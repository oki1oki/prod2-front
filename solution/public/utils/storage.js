class Storage {
    get(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    remove(key) {
        localStorage.removeItem(key);
    }
}

export const storage = new Storage();

export const saveMockData = async () => {
    if (!storage.get('tests')?.length) {
        try {
            const res = await fetch('./data.json');
            const testsData = await res.json();

            storage.set(
                'tests',
                testsData.map(test => ({...test, isMockTest: true}))
            );
        } catch (error) {
            console.error(`Ошибка при загрузке data.json: ${error}`);
            storage.set('tests', []);
        }
    }
};
