import {RunTestService} from '/services/run-test.service';
import {storage, saveMockData} from '/utils/storage';

const prevBtn = document.querySelector('.prev-question-btn');
const nextBtn = document.querySelector('.next-question-btn');
const endTestBtn = document.querySelector('.end-test-btn');
const repeatTestBtn = document.querySelector('.repeat-test-btn');

const testId = new URLSearchParams(window.location.search).get('testId');

document.addEventListener('DOMContentLoaded', async () => {
    await saveMockData();

    const test = storage.get('tests').find(item => item.id === testId);

    if (!testId || !test) {
        window.location.replace('/');
        return;
    }

    if (!storage.get('active-tests')) storage.set('active-tests', []);

    const runTestService = new RunTestService(test);
    document.body.classList.remove('hidden');

    runTestService.renderActiveTest();

    prevBtn.addEventListener('click', runTestService.prevQuestion);
    nextBtn.addEventListener('click', runTestService.nextQuestion);
    endTestBtn.addEventListener('click', runTestService.endTest);
    repeatTestBtn.addEventListener('click', runTestService.repeatTest);
});
