// ==========================================================================
//   CSI 3140 Lab 3 - JavaScript Interactivity
// ==========================================================================

// Ensure DOM is fully loaded before running scripts (defer in HTML also helps)
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initAboutAccordion();
    initDynamicSchedule();
    initFormValidation();
});

// --------------------------------------------------------------------------
// Feature 1: Theme Toggle (Persistent with localStorage)
// --------------------------------------------------------------------------
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    
    // 1. Check if the user already has a saved preference when the page loads
    const savedTheme = localStorage.getItem('clubTheme');
    
    // 2. If they saved 'dark', apply it immediately to the body
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // 3. If the button exists on this specific page, set up its initial text and click event
    if (themeBtn) {
        // Update button text based on the initial load state
        if (document.body.classList.contains('dark-mode')) {
            themeBtn.textContent = "Switch to Light Mode";
        } else {
            themeBtn.textContent = "Switch to Dark Mode";
        }

        // Add the click listener
        themeBtn.addEventListener('click', () => {
            // Toggle the class on the body
            document.body.classList.toggle('dark-mode');
            
            // Check if it's currently dark mode and save/update the preference
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('clubTheme', 'dark');
                themeBtn.textContent = "Switch to Light Mode";
            } else {
                localStorage.setItem('clubTheme', 'light');
                themeBtn.textContent = "Switch to Dark Mode";
            }
        });
    }
}

// --------------------------------------------------------------------------
// Feature 2: Show/Hide Content (DOM Manipulation / Event Handling)
// --------------------------------------------------------------------------
function initAboutAccordion() {
    const toggleBtn = document.getElementById('more-info-btn');
    const infoSection = document.getElementById('more-info-content');

    if (toggleBtn && infoSection) {
        toggleBtn.addEventListener('click', () => {
            // Toggle the hidden class
            infoSection.classList.toggle('hidden');
            
            // Provide textual feedback
            if (infoSection.classList.contains('hidden')) {
                toggleBtn.textContent = "Show More Club Details";
            } else {
                toggleBtn.textContent = "Hide Club Details";
            }
        });
    }
}

// --------------------------------------------------------------------------
// Feature 3: Dynamic Data Rendering (JavaScript Data Structures)
// --------------------------------------------------------------------------
// Initializes the dynamic schedule rendering and filtering logic
function initDynamicSchedule() {
    // Grab the main container where the grid layout items will be injected
    const scheduleContainer = document.getElementById('dynamic-schedule-data');
    // Grab the dropdown menu used for filtering the days
    const dayFilter = document.getElementById('day-filter');

    // Safety guard: If the container isn't on this specific webpage, exit the function early
    if (!scheduleContainer) return;
    
    // Centralized array of objects holding the raw schedule data for easy maintenance
    const sessions = [
        { day: "Monday", time: "09:00 AM", loc: "MRT Room 401" },
        { day: "Wednesday", time: "11:00 AM", loc: "Colonel By 2060" },
        { day: "Friday", time: "01:00 PM", loc: "UCU Auditorium" },
        { day: "Saturday", time: "08:00 PM", loc: "Casino Trip (Monthly)" }
    ];

    // Core function handles filtering the array and rendering elements to the DOM
    function renderSchedule(filterDay) {
        // Clear out any existing schedule items to prevent duplication on re-renders
        scheduleContainer.innerHTML = "";

        // Use a ternary operator to decide whether to show everything or pull a specific day
        const filteredSessions = filterDay === "all"
            ? sessions
            : sessions.filter(session => session.day === filterDay);

        // Loop through each filtered session object to generate the UI elements
        filteredSessions.forEach(session => {
            // Create, style, and populate the text node for the Day column
            const dayDiv = document.createElement('div');
            dayDiv.className = 'grid-item';
            dayDiv.textContent = session.day;

            // Create, style, and populate the text node for the Time column
            const timeDiv = document.createElement('div');
            timeDiv.className = 'grid-item';
            timeDiv.textContent = session.time;

            // Create, style, and populate the text node for the Location column
            const locDiv = document.createElement('div');
            locDiv.className = 'grid-item';
            locDiv.textContent = session.loc;

            // Append all three columns sequentially into the grid container
            scheduleContainer.appendChild(dayDiv);
            scheduleContainer.appendChild(timeDiv);
            scheduleContainer.appendChild(locDiv);
        });
    }

    // Run an initial render on page load to display all upcoming sessions by default
    renderSchedule("all");

    // If the dropdown filter exists on the page, set up its change listener
    if (dayFilter) {
        dayFilter.addEventListener("change", () => {
            // Re-render the schedule dynamically based on the newly selected dropdown value
            renderSchedule(dayFilter.value);
        });
    }
}


function initFormValidation() {
    const form = document.getElementById('reg-form');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default submission
        
        let isValid = true;

        // Select Inputs and Error Spans
        const fNameInput = document.getElementById('first-name');
        const fNameError = document.getElementById('fname-error');
        
        // NEW: Grab the Last Name elements
        const lNameInput = document.getElementById('last-name');
        const lNameError = document.getElementById('lname-error');
        
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        
        const yearSelect = document.getElementById('year');
        const yearError = document.getElementById('year-error');
        
        const successMessage = document.getElementById('form-success');

        // Reset previous errors
        resetError(fNameInput, fNameError);
        resetError(lNameInput, lNameError); // NEW: Reset last name error
        resetError(emailInput, emailError);
        resetError(yearSelect, yearError);
        successMessage.classList.add('hidden');

        // 1. Validate First Name 
        if (fNameInput.value.trim() === "") {
            showError(fNameInput, fNameError, "First name is required.");
            isValid = false;
        }

        // NEW: Validate Last Name
        if (lNameInput.value.trim() === "") {
            showError(lNameInput, lNameError, "Last name is required.");
            isValid = false;
        }

        // 2. Validate Email
        const emailValue = emailInput.value.trim();
        if (emailValue === "") {
            showError(emailInput, emailError, "Email is required.");
            isValid = false;
        } else if (!emailValue.includes("@")) {
            showError(emailInput, emailError, "Please enter a valid email address containing '@'.");
            isValid = false;
        } else if (!emailValue.endsWith("@uottawa.ca")) {
            showError(emailInput, emailError, "You must register with a valid @uottawa.ca email.");
            isValid = false;
        }

        // 3. Validate Academic Year
        if (yearSelect.value === "") {
            showError(yearSelect, yearError, "Please select an academic year.");
            isValid = false;
        }

        // If valid, show success message and clear form
        if (isValid) {
            successMessage.classList.remove('hidden');
            form.reset();
        }
    });
}

// Helper Functions for Validation Accessibility
function showError(inputElement, errorElement, message) {
    errorElement.textContent = message;
    inputElement.classList.add('input-error');
    // Ensure screen readers announce the error
    errorElement.setAttribute("role", "alert"); 
}

function resetError(inputElement, errorElement) {
    errorElement.textContent = "";
    inputElement.classList.remove('input-error');
    errorElement.removeAttribute("role");
}