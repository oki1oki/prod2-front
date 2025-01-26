import {ActiveTestStore} from './utils/active-test-store';
import {endTestModalTpl, navbarItemTpl, questionCardTpl, repeatTestModalTpl, resultTestModalTpl} from './utils/templates';

export class RunTestService {
    constructor(test) {
        this.test = test;
        this.main = document.querySelector('main');

        this.useTestState = new ActiveTestStore(test);
        this.testState = this.useTestState.getState();
    }

    renderActiveTest = () => {
        const test = this.test;
        const testTitle = this.main.querySelector('.test-title');
        const navbar = this.main.querySelector('.navbar');

        testTitle.innerText = test.title;

        let firstUnfinishedQuestionId = null;

        test.questions.forEach((item, i) => {
            const navbarItem = navbarItemTpl(item, i + 1);
            const questionCard = questionCardTpl(item);
            const question = this.testState.answers[item.id];

            if (question.chosenId !== null) {
                const isCorrect = question.isCorrect;

                this.offCompleteQuestion(navbarItem, questionCard, question.chosenId, isCorrect);
            } else if (firstUnfinishedQuestionId === null) {
                firstUnfinishedQuestionId = item.id;

                navbarItem.classList.add('active');
                questionCard.classList.add('active');
            }

            questionCard.addEventListener('click', e => {
                if (e.target.classList.contains('option')) {
                    const answerId = e.target.getAttribute('data-option-id');

                    this.answerQuestion(questionCard.getAttribute('data-question-id'), answerId);
                }
            });

            navbarItem.addEventListener('click', () => this.useNavbar(navbarItem));
            navbar.querySelector('.navbar-list').appendChild(navbarItem);
            this.main.querySelector('.questions-container').appendChild(questionCard);
        });

        if (firstUnfinishedQuestionId === null) {
            const questionId = test.questions[0].id;

            const navbarItem = navbar.querySelector(`.navbar-list-item[data-question-id="${questionId}"]`);
            const questionCard = this.main.querySelector(`.question-card[data-question-id="${questionId}"]`);

            navbarItem?.classList.add('active');
            questionCard?.classList.add('active');
        }

        if (this.testState.isCompleted) {
            this.main.querySelector('.end-test-btn').style.display = 'none';
            this.main.querySelector('.repeat-test-btn').style.display = 'block';

            this.main.querySelectorAll('.option').forEach(item => (item.disabled = true));
        }

        this.updatePaginationButtonsState();
    };

    useNavbar = navbarItem => {
        this.main.querySelector('.question-card.active')?.classList.remove('active');
        this.main.querySelector('.navbar-list-item.active')?.classList.remove('active');

        navbarItem.classList.add('active');

        const questionId = navbarItem.dataset.questionId;

        const targetCard = this.main.querySelector(`.question-card[data-question-id="${questionId}"]`);
        targetCard?.classList.add('active');

        this.updatePaginationButtonsState();
    };

    answerQuestion = (questionId, chosenAnswerId) => {
        const correctAnswerId = this.test.questions.find(item => item.id === questionId).correct;
        const isCorrect = correctAnswerId === chosenAnswerId;

        this.useTestState.updateAnswer(questionId, chosenAnswerId, isCorrect);

        const navbarItem = this.main.querySelector(`.navbar-list-item[data-question-id=${questionId}]`);
        const questionCard = this.main.querySelector(`.question-card[data-question-id=${questionId}]`);

        this.offCompleteQuestion(navbarItem, questionCard, chosenAnswerId, isCorrect);
    };

    prevQuestion = () => {
        const curQuestion = this.main.querySelector('.question-card.active');
        const prevQuestion = curQuestion.previousElementSibling;

        if (!prevQuestion) return;

        const curNavbarItem = this.main.querySelector('.navbar-list-item.active');
        const prevNavbarItem = curNavbarItem.previousElementSibling;

        curQuestion.classList.remove('active');
        curNavbarItem.classList.remove('active');

        prevQuestion.classList.add('active');
        prevNavbarItem.classList.add('active');

        this.updatePaginationButtonsState();
    };

    nextQuestion = () => {
        const curQuestion = this.main.querySelector('.question-card.active');
        const nextQuestion = curQuestion.nextElementSibling;

        if (!nextQuestion) return;

        const curNavbarItem = this.main.querySelector('.navbar-list-item.active');
        const nextNavbarItem = curNavbarItem.nextElementSibling;

        curQuestion.classList.remove('active');
        curNavbarItem.classList.remove('active');

        nextQuestion.classList.add('active');
        nextNavbarItem.classList.add('active');

        this.updatePaginationButtonsState();
    };

    updatePaginationButtonsState = () => {
        const currentQuestion = this.main.querySelector('.question-card.active');
        const prevBtn = this.main.querySelector('.prev-question-btn');
        const nextBtn = this.main.querySelector('.next-question-btn');

        prevBtn.disabled = !currentQuestion?.previousElementSibling;
        nextBtn.disabled = !currentQuestion?.nextElementSibling;
    };

    offCompleteQuestion = (navbarItem, questionCard, chosenId, isCorrect) => {
        const chosenOption = questionCard.querySelector(`.option[data-option-id='${chosenId}']`);

        if (isCorrect) {
            navbarItem.classList.add('success');
            chosenOption.classList.add('success');
        } else {
            navbarItem.classList.add('failed');
            chosenOption.classList.add('failed');
        }

        questionCard.querySelectorAll('.option').forEach(item => {
            if (item.getAttribute('data-option-id') !== chosenId) {
                item.disabled = true;
            }
        });
    };

    endTest = () => {
        const modal = document.querySelector('.modal');
        const endTestBtn = this.main.querySelector('.end-test-btn');
        const repeatTestBtn = this.main.querySelector('.repeat-test-btn');
        const result = this.testState;

        if (Object.keys(result?.answers).length === result?.totalAnswersCount) {
            modal.innerHTML = resultTestModalTpl(result, true);

            modal.showModal();

            endTestBtn.style.display = 'none';
            repeatTestBtn.style.display = 'block';

            const understandBtn = modal.querySelector('button[id=understand]');

            understandBtn.addEventListener('click', () => {
                modal.close();
            });

            return;
        }

        modal.innerHTML = endTestModalTpl();

        const noBtn = modal.querySelector('button[id=no]');
        const yesBtn = modal.querySelector('button[id=yes]');

        modal.showModal();

        yesBtn.addEventListener('click', () => {
            this.useTestState.toggleTestComplete();
            this.main.querySelectorAll('.option').forEach(item => (item.disabled = true));

            endTestBtn.style.display = 'none';
            repeatTestBtn.style.display = 'block';

            modal.innerHTML = resultTestModalTpl(result);
            const understandBtn = modal.querySelector('button[id=understand]');

            understandBtn.addEventListener('click', () => {
                modal.close();
            });
        });

        noBtn.addEventListener('click', () => {
            modal.close();
        });
    };

    repeatTest = () => {
        const modal = document.querySelector('.modal');

        modal.innerHTML = repeatTestModalTpl();
        modal.showModal();

        const noBtn = modal.querySelector('button[id=no]');
        const yesBtn = modal.querySelector('button[id=yes]');

        yesBtn.addEventListener('click', () => {
            this.useTestState.clearTestState();

            window.location.reload();
        });

        noBtn.addEventListener('click', () => {
            modal.close();
        });
    };
}
