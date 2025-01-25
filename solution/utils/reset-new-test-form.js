export const resetNewTestForm = form => {
    const questions = form.querySelector('.new-test-questions');
    const textFields = form.querySelectorAll('input[type="text"]');
    const errorMessage = form.querySelector('.error-message');

    while (questions.children.length > 1) {
        questions.lastChild.remove();
    }

    textFields.forEach(item => item.classList.remove('invalid'));

    errorMessage.innerText = '';

    form.reset();
};
