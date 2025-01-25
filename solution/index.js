import {ManageTestService} from './services/manage-test.service';
import {resetNewTestForm} from './utils/reset-new-test-form';
import {saveMockData} from './utils/storage';

const addTestBtn = document.querySelector('.add-test-btn');
const addQuestionBtn = document.querySelector('.add-question-btn');
const removeQuestionBtn = document.querySelector('.remove-question-btn');

const newTestForm = document.querySelector('.new-test-form');
const modal = document.querySelector('.new-test-modal');

const manageTestService = new ManageTestService(newTestForm);

document.addEventListener('DOMContentLoaded', async () => {
    await saveMockData();

    manageTestService.renderTests();
});

document.querySelector('.tests-list').addEventListener('click', e => {
    if (e.target.classList.contains('tests-list-item-delete')) {
        manageTestService.deleteTest(e.target.dataset.testId);
    }
});

addTestBtn.addEventListener('click', () => modal.showModal());
addQuestionBtn.addEventListener('click', manageTestService.addQuestion);
removeQuestionBtn.addEventListener('click', manageTestService.removeQuestion);
newTestForm.addEventListener('submit', manageTestService.saveTest);

modal.addEventListener('click', e => {
    // Клик на backdrop
    if (e.target === modal) {
        modal.close();
        resetNewTestForm(newTestForm);
    }
});
