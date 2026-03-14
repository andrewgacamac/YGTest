import json
import os

with open('package.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

if 'engines' not in data:
    data['engines'] = {}
data['engines']['node'] = '>=18'

with open('package.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
