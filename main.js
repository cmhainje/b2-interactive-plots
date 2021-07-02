// Momentum bin ranges
const p_ranges = [
    '[0.5, 1.0] GeV', '[1.0, 1.5] GeV', '[1.5, 2.0] GeV', '[2.0, 2.5] GeV',
    '[2.5, 3.0] GeV', '[3.0, 3.5] GeV', '[3.5, 4.5] GeV'
];

// Theta bin ranges
const theta_ranges = [
    '[17°, 28°]', '[28°, 40°]',  '[40°, 60°]',   '[60°, 77°]',
    '[77°, 96°]', '[96°, 115°]', '[115°, 133°]', '[133°, 150°]',
];

// References to the relevant elements
const image = document.getElementById('image');
const image_selector = document.getElementById('image-select');
const dset_selector = document.getElementById('dset-select');
const bin_selector = document.getElementById('bin-select');
const slider_p = document.getElementById('slider-p');
const slider_theta = document.getElementById('slider-theta');
const string_p = document.getElementById('string-p');
const string_theta = document.getElementById('string-theta');

// Event listeners
function makeFilename() {
    let s = dset_selector.value + "/" + image_selector.value;
    if (bin_selector.value == "bin")
        s += "p" + slider_p.value + "_theta" + slider_theta.value;
    s += ".png";
    return s;
}

dset_selector.addEventListener('change', (event) => {
    image.src = makeFilename();
})

image_selector.addEventListener('change', (event) => {
    image.src = makeFilename();
})

bin_selector.addEventListener('change', (event) => {
    if (event.target.value == 'bin') {
        string_p.style.display = 'inline';
        slider_p.style.display = 'inline';
        string_theta.style.display = 'inline';
        slider_theta.style.display = 'inline';
        for (el of document.getElementsByClassName('nobinonly'))
            el.disabled = true;
        image.src = makeFilename();
    }

    else {
        string_p.style.display = 'none';
        slider_p.style.display = 'none';
        string_theta.style.display = 'none';
        slider_theta.style.display = 'none';
        for (el of document.getElementsByClassName('nobinonly'))
            el.disabled = false;
        image.src = makeFilename();
    }
})

slider_p.addEventListener('input', (event) => {
    const p_index = image.src.lastIndexOf('/p');
    string_p.innerHTML = `p: ${p_ranges[parseInt(event.target.value)]}`
    image.src = makeFilename();
});

slider_theta.addEventListener('input', (event) => {
    const theta_index = image.src.lastIndexOf('_theta');
    string_theta.innerHTML = `theta: ${theta_ranges[parseInt(event.target.value)]}`
    image.src = makeFilename();
});


