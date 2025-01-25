import {storage} from '../utils/storage';
import {generateId} from '../utils/generate-id';
import {emptyTestsMessageTpl, testListElementTpl} from '../utils/templates';
import {resetNewTestForm} from '../utils/reset-new-test-form';

export class ManageTestService {
    constructor(newTestForm) {
        this.form = newTestForm;
        this.questionsContainer = newTestForm.querySelector('.new-test-questions');
        this.testsList = document.querySelector('.tests-list');
    }

    renderTests() {
        this.testsList.innerHTML = '';
        const tests = storage.get('tests');

        if (!tests?.length) {
            this.testsList.innerHTML = emptyTestsMessageTpl();
        } else {
            tests.forEach(item => {
                this.testsList.appendChild(testListElementTpl(item));
            });
        }
    }

    addQuestion = () => {
        const questions = this.questionsContainer;
        const questionNumber = questions.children.length + 1;
        const newQuestion = document.createElement('div');

        newQuestion.className = 'new-question';
        newQuestion.innerHTML = `
            <label for="q${questionNumber}">Вопрос ${questionNumber}</label>
            <input type="text" id="q${questionNumber}" class="new-question-name" test-id="new-test-question"/>
            <div class="new-question-options">
                <div class="new-option" test-id="new-test-options">
                    <input type="radio" id="option${questionNumber}1" name="option${questionNumber}" />
                    <input type="text" class="new-option-text" />
                </div>
                <div class="new-option">
                    <input type="radio" id="option${questionNumber}2" name="option${questionNumber}" />
                    <input type="text" class="new-option-text" />
                </div>
                <div class="new-option">
                    <input type="radio" id="option${questionNumber}3" name="option${questionNumber}" />
                    <input type="text" class="new-option-text" />
                </div>
                <div class="new-option">
                    <input type="radio" id="option${questionNumber}4" name="option${questionNumber}" />
                    <input type="text" class="new-option-text" />
                </div>
            </div>
        `;

        questions.appendChild(newQuestion);
    };

    removeQuestion = () => {
        const questions = this.questionsContainer;

        if (questions.children.length > 1) {
            questions.removeChild(questions.lastChild);
        }
    };

    validateForm = () => {
        const form = this.form;

        let noEmptyFields = true;
        let noEmptyAnswers = true;
        const errorMessage = form.querySelector('.error-message');

        const textFields = form.querySelectorAll('input[type="text"]');

        textFields.forEach(item => item.classList.remove('invalid'));

        textFields.forEach(item => {
            if (!item.value.trim()) {
                item.classList.add('invalid');
                noEmptyFields = false;
            }
        });

        if (!noEmptyFields) {
            errorMessage.innerText = 'Все поля должны быть заполнены';
            errorMessage.style.opacity = '1';
            return false;
        }

        const questions = form.querySelectorAll('.new-question');

        for (const question of questions) {
            const radioBtns = question.querySelectorAll('input[type="radio"]');
            let answerSelected = false;

            radioBtns.forEach(item => {
                if (item.checked) {
                    answerSelected = true;
                }
            });

            if (!answerSelected) {
                noEmptyAnswers = false;
                break;
            }
        }

        if (!noEmptyAnswers) {
            errorMessage.innerText = 'Выберите правильный ответ в созданных вопросах';
            errorMessage.style.opacity = '1';
            return false;
        }

        errorMessage.innerText = '';
        return true;
    };

    saveTest = e => {
        e.preventDefault();

        const isValidForm = this.validateForm();

        if (!isValidForm) {
            return;
        }

        const modal = document.querySelector('.new-test-modal');

        const testData = {
            id: generateId(),
            title: this.form.querySelector('#new-test-title').value,
            questions: [],
            isMockTest: false,
        };
        const questions = this.questionsContainer.children;

        Array.from(questions).forEach(question => {
            const questionText = question.querySelector('.new-question-name').value;
            const questionId = generateId();

            const options = question.querySelectorAll('.new-option');
            let correctOptionId = '';

            const optionsData = Array.from(options).map(option => {
                const optionText = option.querySelector('.new-option-text').value;
                const optionId = generateId();

                const radio = option.querySelector('input[type="radio"]');
                if (radio.checked) {
                    correctOptionId = optionId;
                }

                return {
                    id: optionId,
                    text: optionText,
                };
            });

            testData.questions.push({
                id: questionId,
                question: questionText,
                options: optionsData,
                correct: correctOptionId,
            });
        });

        const prevTests = storage.get('tests') || [];

        if (!prevTests.length) {
            this.testsList.innerHTML = '';
        }

        storage.set('tests', [...prevTests, testData]);

        this.testsList.appendChild(testListElementTpl(testData));

        resetNewTestForm(this.form);
        modal.close();
    };

    deleteTest = id => {
        const tests = storage.get('tests');

        // Проверка на попытку удаления теста из data.json
        if (tests.find(item => item.id === id).isMockTest) return;

        const newTests = tests.filter(item => item.id !== id);
        storage.set('tests', newTests);

        document.querySelector(`li[data-test-id="${id}"]`).remove();

        if (tests.length === 1) {
            this.testsList.innerHTML = emptyTestsMessageTpl();
        }
    };
}
