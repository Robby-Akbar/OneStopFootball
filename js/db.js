import idb from "idb";

let dbPromise = idb.open("mydatabase", 1, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains("teams")) {
        upgradeDb.createObjectStore("teams");
    }
});

dbPromise.then(function(db) {
    let tx = db.transaction('teams', 'readwrite');
    let store = tx.objectStore('teams');
    let item = {
        judul: 'Menjadi Android Developer Expert (MADE)',
        isbn: 123456789,
        description: 'Belajar pemrograman Android di Dicoding dengan modul online dan buku.',
        created: new Date().getTime()
    };
    store.add(item, 123456789); //menambahkan key "buku"
    return tx.complete;
}).then(function() {
    console.log('Buku berhasil disimpan.');
}).catch(function() {
    console.log('Buku gagal disimpan.')
});

dbPromise.then(function(db) {
    let tx = db.transaction('buku', 'readonly');
    let store = tx.objectStore('buku');
    // mengambil primary key berdasarkan isbn
    return store.get(123456789);
}).then(function(val) {
    console.dir(val);
});

dbPromise.then(function(db) {
    let tx = db.transaction('buku', 'readonly');
    let store = tx.objectStore('buku');
    return store.getAll();
}).then(function(items) {
    console.log('Data yang diambil: ');
    console.log(items);
});

dbPromise.then(function(db) {
    let tx = db.transaction('buku', 'readonly');
    let store = tx.objectStore('buku');
    return store.openCursor();
}).then(function ambilBuku(cursor) {
    if (!cursor) {
        return;
    }
    console.log('Posisi cursos: ', cursor.key);
    for (let field in cursor.value) {
        console.log(cursor.value[field]);
    }
    return cursor.continue().then(ambilBuku);
}).then(function() {
    console.log('Tidak ada data lain.');
});

dbPromise.then(function(db) {
    let tx = db.transaction('buku', 'readwrite');
    let store = tx.objectStore('buku');
    let item = {
        judul: 'Menjadi Android Developer Expert (MADE)',
        isbn: 123456789,
        description: 'Belajar pemrograman Android di Dicoding dengan modul online dan buku.',
        created: new Date().getTime()
    };
    store.put(item, 123456789); //menambahkan KEY
    return tx.complete;
}).then(function() {
    console.log('Buku berhasil disimpan.');
}).catch(function() {
    console.error('Buku gagal disimpan.')
});

dbPromise.then(function(db) {
    let tx = db.transaction('store', 'readwrite');
    let store = tx.objectStore('store');
    store.delete('123456789');
    return tx.complete;
}).then(function() {
    console.log('Item deleted');
});
