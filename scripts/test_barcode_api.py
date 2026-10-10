import urllib.request
import json

BASE = 'http://127.0.0.1:8001/api/barcode'

def req(url, method='GET', data=None):
    headers = {'Content-Type': 'application/json'}
    body = json.dumps(data).encode('utf-8') if data else None
    r = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))

# Reset first
req(f'{BASE}/reset', 'POST')

# 1. Test Product 1: Coca Cola
s1, p1 = req(f'{BASE}/products', 'POST', {
    'productName': 'Coca Cola',
    'brandName': 'The Coca-Cola Company',
    'category': 'Beverages',
    'servingSize': '250ml',
    'calories': 105,
    'protein': 0,
    'carbohydrates': 27,
    'fat': 0,
    'sugar': 27,
    'fiber': 0,
    'sodium': 30,
    'ingredients': ['Carbonated Water', 'Sugar', 'Phosphoric Acid'],
    'allergens': [],
    'description': 'Refreshing cola drink'
})
assert s1 == 200, f'Create p1 failed: {s1} {p1}'
assert p1['serialNumber'] == 1, f"Expected serial 1, got {p1['serialNumber']}"
assert p1['barcode'] == '890100000001', f"Expected barcode 890100000001, got {p1['barcode']}"
print('[PASS] Product 1 (Coca Cola) registered with Serial 1 and Barcode 890100000001')

# 2. Test Product 2: Lays Classic
s2, p2 = req(f'{BASE}/products', 'POST', {
    'productName': 'Lays Classic',
    'brandName': 'Frito-Lay',
    'category': 'Snacks & Chips',
    'servingSize': '30g',
    'calories': 160,
    'protein': 2,
    'carbohydrates': 15,
    'fat': 10,
    'sugar': 0.5,
    'fiber': 1,
    'sodium': 170,
    'ingredients': ['Potatoes', 'Vegetable Oil', 'Salt'],
    'allergens': [],
    'description': 'Crispy potato chips'
})
assert s2 == 200, f'Create p2 failed: {s2} {p2}'
assert p2['serialNumber'] == 2, f"Expected serial 2, got {p2['serialNumber']}"
assert p2['barcode'] == '890100000002', f"Expected barcode 890100000002, got {p2['barcode']}"
print('[PASS] Product 2 (Lays Classic) registered with Serial 2 and Barcode 890100000002')

# 3. Test Product 3: Amul Milk
s3, p3 = req(f'{BASE}/products', 'POST', {
    'productName': 'Amul Milk',
    'brandName': 'Amul',
    'category': 'Dairy & Milk',
    'servingSize': '200ml',
    'calories': 130,
    'protein': 6.4,
    'carbohydrates': 10,
    'fat': 7,
    'sugar': 0,
    'fiber': 0,
    'sodium': 100,
    'ingredients': ['Pasteurized Homogenized Cow Milk'],
    'allergens': ['Milk'],
    'description': 'Fresh cow milk'
})
assert s3 == 200, f'Create p3 failed: {s3} {p3}'
assert p3['serialNumber'] == 3, f"Expected serial 3, got {p3['serialNumber']}"
assert p3['barcode'] == '890100000003', f"Expected barcode 890100000003, got {p3['barcode']}"
print('[PASS] Product 3 (Amul Milk) registered with Serial 3 and Barcode 890100000003')

# 4. Test Barcode Lookup
s_look, p_look = req(f'{BASE}/lookup/890100000001')
assert s_look == 200 and p_look['productName'] == 'Coca Cola'
print('[PASS] Barcode lookup 890100000001 correctly returned Coca Cola')

# 5. Test Unknown Barcode Lookup
s_unk, p_unk = req(f'{BASE}/lookup/890100000099')
assert s_unk == 404
print('[PASS] Unknown barcode 890100000099 correctly rejected with 404 Not Found')

# 6. Test Edit Integrity (Changing name must not alter serial or barcode)
s_edit, p_edit = req(f'{BASE}/products/1', 'PUT', {
    'productName': 'Coca Cola Zero Sugar',
    'sugar': 0,
    'calories': 1
})
assert s_edit == 200
assert p_edit['productName'] == 'Coca Cola Zero Sugar'
assert p_edit['serialNumber'] == 1 and p_edit['barcode'] == '890100000001'
print('[PASS] Edit verified: Updated to Coca Cola Zero Sugar while strictly preserving Serial 1 and Barcode 890100000001')

# 7. Test Delete without shifting serial numbers
s_del, _ = req(f'{BASE}/products/2', 'DELETE')
assert s_del == 200
s_list, p_list = req(f'{BASE}/products')
serials = [p['serialNumber'] for p in p_list]
assert serials == [1, 3], f'Serials should be [1, 3], got {serials}'
print('[PASS] Delete verified: Deleted Product #2, remaining serials are [1, 3] (not shifted)')

# 8. Re-registering fills slot #2
s_reuse, p_reuse = req(f'{BASE}/products', 'POST', {'productName': 'Lays Classic'})
assert p_reuse['serialNumber'] == 2 and p_reuse['barcode'] == '890100000002'
print('[PASS] Slot reuse verified: New product filled available slot #2 with Barcode 890100000002')

print('\nALL 8 SYSTEM INTEGRATION TESTS PASSED PERFECTLY!')
