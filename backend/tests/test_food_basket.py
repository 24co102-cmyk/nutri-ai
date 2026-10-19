import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from app.main import app
from app.services.food_catalog import load_catalog, get_all_catalog_items

client = TestClient(app)

def test_catalog_loaded_integrity():
    catalog = load_catalog()
    assert catalog is not None
    items = catalog.get("items", [])
    assert len(items) == 233, f"Expected 233 reference items, got {len(items)}"

def test_basket_endpoint_public_access():
    """Verify Food Basket gallery is accessible without authentication token."""
    res = client.get("/api/photo/basket")
    assert res.status_code == 200, f"Expected 200 OK, got {res.status_code}: {res.text}"
    data = res.json()
    assert data.get("success") is True
    assert data.get("total_items") == 233
    assert data.get("displayed_items") == 233
    assert data.get("total_photos") >= 42
    assert len(data.get("items", [])) == 233

def test_basket_category_filtering():
    """Verify category filtering returns exact matching counts."""
    # Test Fruits
    res_fruits = client.get("/api/photo/basket?category=Fruits")
    assert res_fruits.status_code == 200
    fruits_data = res_fruits.json()
    assert fruits_data.get("displayed_items") == 30

    # Test Vegetables
    res_veg = client.get("/api/photo/basket?category=Vegetables")
    assert res_veg.status_code == 200
    assert res_veg.json().get("displayed_items") == 30

    # Test Indian Dishes
    res_indian = client.get("/api/photo/basket?category=Indian%20Dishes")
    assert res_indian.status_code == 200
    assert res_indian.json().get("displayed_items") == 66

def test_basket_search_filtering():
    """Verify search filter matches food names and aliases."""
    res_apple = client.get("/api/photo/basket?q=apple")
    assert res_apple.status_code == 200
    data = res_apple.json()
    items = data.get("items", [])
    assert any("apple" in i["name"].lower() for i in items)

    res_biryani = client.get("/api/photo/basket?q=biryani")
    assert res_biryani.status_code == 200
    b_items = res_biryani.json().get("items", [])
    assert len(b_items) >= 2  # Chicken biryani, mutton biryani, etc.

def test_basket_download_photo():
    """Verify genuine image download returns real binary file, not HTML/JSON."""
    res = client.get("/api/photo/basket/download?filename=apple.jpg")
    assert res.status_code == 200
    assert "image/jpeg" in res.headers.get("content-type", "")
    assert len(res.content) > 5000  # Genuine high-res binary photo
    assert "attachment" in res.headers.get("content-disposition", "")
    assert "apple.jpg" in res.headers.get("content-disposition", "")

def test_basket_download_svg():
    """Verify SVG download works cleanly."""
    res = client.get("/api/photo/basket/download?filename=apple.svg")
    assert res.status_code == 200
    assert "svg" in res.headers.get("content-type", "")
    assert len(res.content) > 200
    assert "apple.svg" in res.headers.get("content-disposition", "")

def test_basket_download_by_item_id():
    """Verify lookup by catalog item_id downloads the verified file."""
    res = client.get("/api/photo/basket/download?item_id=food_0001")
    assert res.status_code == 200
    assert len(res.content) > 5000
    assert "attachment" in res.headers.get("content-disposition", "")
