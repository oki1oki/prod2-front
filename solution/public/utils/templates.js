export const testListElementTpl = test => {
    const li = document.createElement('li');

    li.className = 'tests-list-item';
    li.dataset.testId = test.id;
    li.innerHTML = `
        <a href="/test/index.html?testId=${test.id}" class="tests-list-item-link" test-id="list-item-title">
            ${test.title}
        </a>
        <button class="tests-list-item-delete" data-test-id=${test.id} test-id="list-item-delete">🗑</button>
    `;

    return li;
};

export const emptyTestsMessageTpl = () => `
    <div style="margin: 32px auto; text-align: center">
        <p style="margin-bottom: 16px">Список тестов пуст. Скорее создавай новый тест и зови друзей!</p>
        <img src="/test.svg" width="40px"/>
    </div>
    `;

export const navbarItemTpl = (question, i) => {
    const li = document.createElement('li');
    li.className = 'navbar-list-item';
    li.dataset.questionId = question.id;
    li.setAttribute('test-id', 'navigation-item');
    li.innerHTML = `Вопрос ${i}`;

    return li;
};

export const questionCardTpl = question => {
    const div = document.createElement('div');
    div.className = 'question-card';
    div.dataset.questionId = question.id;
    div.setAttribute('test-id', 'question');
    div.innerHTML = `
        <h2 class="question-title">${question.question}</h2>
        <div class="question-options">
            ${question.options
                .map(
                    item => `
                <button class="option" data-option-id="${item.id}" test-id="question-option">
                    ${item.text}
                </button>
            `
                )
                .join('')}
        </div>
    `;

    return div;
};

export const endTestModalTpl = () => `
        <h2>Вы точно хотите завершить тест?</h2>
        <div class="modal-btns">
            <button id="yes">Да</button>
            <button id="no">Нет</button>
        </div>
    `;

export const repeatTestModalTpl = () => `
        <h2>Вы точно хотите перепройти тест?</h2>
        <div class="modal-btns">
            <button id="yes">Да</button>
            <button id="no">Нет</button>
        </div>
`;

export const resultTestModalTpl = (result, allAnswered = false) => `
        <h2>Вы завершили тест</h2>
        <div class='modal-content'>
            <p>Правильных ответов - ${result?.correctAnswersCount}</p>
            <p>Неправильных ответов - ${result?.wrongAnswersCount}</p>
            ${!allAnswered ? `<p>Вопросов без ответа - ${Object.keys(result?.answers).length - result?.totalAnswersCount}</p>` : ''}
        </div>
        
        <div class="modal-btns">
            <button id="understand">Понятно</button>
        </div>
`;
