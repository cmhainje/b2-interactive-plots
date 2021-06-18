// Momentum bin ranges
const p_ranges = [
    '[0.5, 1.0] GeV', '[1.0, 1.5] GeV', '[1.5, 2.0] GeV', '[2.0, 2.5] GeV',
    '[2.5, 3.0] GeV', '[3.0, 3.5] GeV', '[3.5, 4.5] GeV'
]

// Theta bin ranges
const theta_ranges = [
    '[17°, 28°]', '[28°, 40°]',  '[40°, 60°]',   '[60°, 77°]',
    '[77°, 96°]', '[96°, 115°]', '[115°, 133°]', '[133°, 150°]',
]

// References to the relevant elements
const image = document.getElementById('image');
const image_selector = document.getElementById('image-select')
const slider_p = document.getElementById('slider-p');
const slider_theta = document.getElementById('slider-theta');
const string_p = document.getElementById('string-p');
const string_theta = document.getElementById('string-theta');

// Event listeners
image_selector.addEventListener('change', (event) => {
    const folder_end_index = image.src.lastIndexOf('/p');
    image.src = String(event.target.value) + image.src.substr(folder_end_index);
})

slider_p.addEventListener('input', (event) => {
    const p_index = image.src.lastIndexOf('/p');
    image.src = image.src.substr(0, p_index + 2) + String(event.target.value) + image.src.substr(p_index + 3);
    string_p.innerHTML = `p: ${p_ranges[parseInt(event.target.value)]}`
});

slider_theta.addEventListener('input', (event) => {
    const theta_index = image.src.lastIndexOf('_theta');
    image.src = image.src.substr(0, theta_index + 6) + String(event.target.value) + image.src.substr(theta_index + 7);
    string_theta.innerHTML = `theta: ${theta_ranges[parseInt(event.target.value)]}`
});


