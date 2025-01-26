import {storage} from './storage';

export class ActiveTestStore {
    constructor(test) {
        this.test = test;
        this.testId = test.id;

        const data = storage.get('active-tests') || [];
        this.state = data.find(item => item.testId === test.id) || this.initTestState(test.questions);
    }

    getState = () => {
        return this.state;
    };

    toggleTestComplete = () => {
        this.state.isCompleted = !this.state.isCompleted;

        this.saveState();
    };

    initTestState = questions => {
        if (this.state) return;

        const initial = {
            testId: this.testId,
            answers: {},
            correctAnswersCount: 0,
            wrongAnswersCount: 0,
            totalAnswersCount: 0,
            isCompleted: false,
        };

        questions.forEach(item => {
            initial.answers[item.id] = {
                chosenId: null,
                isCorrect: null,
            };
        });

        this.state = initial;

        this.saveState();

        return initial;
    };

    updateAnswer = (questionId, chosenAnswerId, isCorrect) => {
        const question = this.state.answers[questionId];

        if (question.chosenId === null) {
            this.state.totalAnswersCount++;

            isCorrect ? this.state.correctAnswersCount++ : this.state.wrongAnswersCount++;

            this.state.answers[questionId] = {
                chosenId: chosenAnswerId,
                isCorrect,
            };

            this.saveState();
        }
    };

    saveState = () => {
        const prevData = storage.get('active-tests').filter(item => item.testId !== this.testId) || [];

        storage.set('active-tests', [...prevData, this.state]);
    };

    clearTestState = testId => {
        const activeTests = storage.get('active-tests') || [];

        const updatedTests = activeTests.filter(item => item.id !== testId);

        updatedTests.length > 0 ? storage.set('active-tests', updatedTests) : storage.remove('active-tests');
    };
}
