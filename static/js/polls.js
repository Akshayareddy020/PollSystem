document.addEventListener('DOMContentLoaded', function() {
    // For Student Dashboard
    if (document.getElementById('polls-list')) {
        loadPollsForStudents();
    }

    // For Teacher Dashboard
    if (document.getElementById('teacher-polls-list')) {
        loadPollsForTeachers();
        setupPollCreation();
    }
});

function loadPollsForStudents() {
    fetch('/poll/active')
    .then(response => response.json())
    .then(polls => {
        const pollsList = document.getElementById('polls-list');
        pollsList.innerHTML = '';
        
        polls.forEach(poll => {
            const pollElement = document.createElement('div');
            pollElement.className = 'poll-card';
            pollElement.innerHTML = `
                <div class="poll-question">${poll.question}</div>
                <div class="poll-options">
                    ${poll.options.map(option => `
                        <div class="poll-option">
                            <input type="radio" name="poll-${poll.id}" id="option-${option.id}" value="${option.id}">
                            <label for="option-${option.id}">${option.text}</label>
                        </div>
                    `).join('')}
                </div>
                <button class="btn submit-poll" data-poll-id="${poll.id}">Submit Answer</button>
            `;
            pollsList.appendChild(pollElement);
        });

        // Add event listeners to submit buttons
        document.querySelectorAll('.submit-poll').forEach(button => {
            button.addEventListener('click', function() {
                const pollId = this.dataset.pollId;
                const selectedOption = document.querySelector(`input[name="poll-${pollId}"]:checked`);
                
                if (!selectedOption) {
                    alert('Please select an option');
                    return;
                }

                submitPollAnswer(pollId, selectedOption.value);
            });
        });
    });
}

function submitPollAnswer(pollId, optionId) {
    // In a real app, you would get student_id from the session
    const studentId = 1; // This should come from your auth system
    
    fetch('/poll/answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            poll_id: pollId,
            option_id: optionId,
            student_id: studentId
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Submission failed');
        return response.json();
    })
    .then(data => {
        alert('Your answer has been submitted!');
        loadPollsForStudents();
    })
    .catch(error => {
        alert(error.message);
    });
}

function loadPollsForTeachers() {
    fetch('/poll/teacher')
    .then(response => response.json())
    .then(polls => {
        const pollsList = document.getElementById('teacher-polls-list');
        pollsList.innerHTML = '';
        
        polls.forEach(poll => {
            const pollElement = document.createElement('div');
            pollElement.className = 'poll-card';
            pollElement.innerHTML = `
                <div class="poll-question">${poll.question}</div>
                <div class="poll-results">
                    <h3>Results</h3>
                    ${poll.results.map(result => `
                        <div class="result-item">
                            <div class="option-text">${result.option_text}</div>
                            <div class="votes">Votes: ${result.votes}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            pollsList.appendChild(pollElement);
        });
    });
}

function setupPollCreation() {
    const modal = document.getElementById('create-poll-modal');
    const btn = document.getElementById('create-poll-btn');
    const span = document.querySelector('.close-modal');
    const addOptionBtn = document.getElementById('add-option');
    const pollForm = document.getElementById('create-poll-form');

    btn.onclick = function() {
        modal.style.display = 'block';
    }

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    addOptionBtn.addEventListener('click', function() {
        const optionsContainer = document.getElementById('poll-options');
        const newOption = document.createElement('div');
        newOption.className = 'option-input';
        newOption.innerHTML = `
            <input type="text" name="options[]" required>
            <button type="button" class="remove-option">×</button>
        `;
        optionsContainer.appendChild(newOption);
        
        // Add event listener to new remove button
        newOption.querySelector('.remove-option').addEventListener('click', function() {
            if (document.querySelectorAll('.option-input').length > 2) {
                this.parentElement.remove();
            } else {
                alert('A poll must have at least 2 options');
            }
        });
    });

    // Add event listeners to existing remove buttons
    document.querySelectorAll('.remove-option').forEach(button => {
        button.addEventListener('click', function() {
            if (document.querySelectorAll('.option-input').length > 2) {
                this.parentElement.remove();
            } else {
                alert('A poll must have at least 2 options');
            }
        });
    });

    pollForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createNewPoll();
    });
}

function createNewPoll() {
    const question = document.getElementById('poll-question').value;
    const options = Array.from(document.querySelectorAll('input[name="options[]"]')).map(input => input.value);
    // In a real app, you would get created_by from the session
    const createdBy = 1; // This should come from your auth system
    
    fetch('/poll/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question,
            options,
            created_by: createdBy
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Poll creation failed');
        return response.json();
    })
    .then(data => {
        alert('Poll created successfully!');
        document.getElementById('create-poll-modal').style.display = 'none';
        document.getElementById('create-poll-form').reset();
        loadPollsForTeachers();
    })
    .catch(error => {
        alert(error.message);
    });
}