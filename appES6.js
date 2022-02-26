// Course Constructor
class Course {
    constructor(title, instructor, image) {
        this.courseID = Math.floor(Math.random() * 10000);
        this.title = title;
        this.instructor = instructor;
        this.image = image
    }
}

// UI Constructor
class UI {

    addCoursToList(course) {
        const list = document.getElementById('course-list');
        let html = `
                <td><img src="/img/${course.image}" style="width:200px; heigth="150px";"></td>
                <td>${course.title}</td>
                <td>${course.instructor}</td>
                <td><a href="#" data-id="${course.courseID}" class="btn btn-danger btn-sm delete">Delete</a></td>
        `;
        list.innerHTML += html;
    }

    clearControl() {
        const title = document.getElementById('title').value = '';
        const instructor = document.getElementById('instructor').value = '';
        const image = document.getElementById('image').value = '';
    }

    deleteCourse(element) {
        const ui = new UI();
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
            return true;
        }
    }

    showAlert(message, className) {
        let alert = `
            <div class="alert alert-${className}">
                ${message}
            </div>
        `;
        const row = document.querySelector('.row');
        row.insertAdjacentHTML('beforebegin', alert);
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2000);
    }
}

// Storage
class Storage {

    static getCourses() {
        let course;
        if (localStorage.getItem('courses') === null) {
            course = [];
        } else {
            course = JSON.parse(localStorage.getItem('courses'));
        }
        return course;
    }

    static displayCourses() {
        const courses = Storage.getCourses();
        courses.forEach(course => {
            const ui = new UI();
            ui.addCoursToList(course);
        });
    }

    static addCourse(course) {
        const courses = Storage.getCourses();
        courses.push(course);
        localStorage.setItem('courses', JSON.stringify(courses));
    }

    static deleteCourse(element) {
        if (element.classList.contains('delete')) {
            const id = element.getAttribute('data-id');
            const courses = Storage.getCourses();

            courses.forEach((cours, index) => {
                if (cours.courseID == id) {
                    courses.splice(index,1);
                }
            });
            localStorage.setItem('courses',JSON.stringify(courses));
        }
    }
}

document.addEventListener('DOMContentLoaded', Storage.displayCourses);
// new course
document.getElementById('new-course').addEventListener('submit', (e) => {
    const title = document.getElementById('title').value;
    const instructor = document.getElementById('instructor').value;
    const image = document.getElementById('image').value;

    // create course
    const course = new Course(title, instructor, image);

    // creat ui
    const ui = new UI();

    if (title.trim() == 0 || instructor.trim() == 0 || image.trim() == 0) {
        ui.showAlert('Please complate the form', 'warning');
    } else {
        // add course to list
        ui.addCoursToList(course);

        // save to LS
        Storage.addCourse(course);

        // clear control
        ui.clearControl();

        // course success
        ui.showAlert('The course has been added', 'success');
    }


    e.preventDefault();
});

// deltete course
document.getElementById('course-list').addEventListener('click', (e) => {
    const ui = new UI();

    // delete course
    if (ui.deleteCourse(e.target) == true) {
        // delete from LS
        Storage.deleteCourse(e.target);

        ui.showAlert('The course has been deleted', 'danger');
    }

});