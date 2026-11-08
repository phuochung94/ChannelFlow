from pathlib import Path
import json, zipfile, hashlib

root = Path(__file__).resolve().parent.parent
source = root / 'extension'
manifest = json.loads((source / 'manifest.json').read_text(encoding='utf-8-sig'))
required = ['manifest.json', manifest['action']['default_popup'], manifest['background']['service_worker']]
for group in manifest['content_scripts']:
    required.extend(group['js'])
required.extend(manifest['icons'].values())
for locale in ('en', 'vi'):
    file = f'_locales/{locale}/messages.json'
    json.loads((source / file).read_text(encoding='utf-8-sig'))
    required.append(file)
for file in required:
    if not (source / file).is_file():
        raise SystemExit(f'Missing extension file: {file}')
destination = root / 'dist' / 'ChannelFlow.zip'
destination.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED) as archive:
    for file in sorted(source.rglob('*')):
        if file.is_file():
            archive.write(file, file.relative_to(source).as_posix())
with zipfile.ZipFile(destination) as archive:
    assert archive.testzip() is None
    assert 'manifest.json' in archive.namelist()
print(f'Built {destination.name} version {manifest["version"]}')
print('SHA256 ' + hashlib.sha256(destination.read_bytes()).hexdigest())
