const image        = document.getElementById("image");
const plot_select  = document.getElementById("plot-select");
const plot_div     = document.getElementById("plot-picker");
const type_select  = document.getElementById("img-type-select");
const part_select  = document.getElementById("part-select");
const part_div     = document.getElementById("particle-type");
const wgt_check    = document.getElementById("weight-toggle");
const wgt_div      = document.getElementById("weight-toggler");
const frc_check    = document.getElementById("rownorm-toggle");
const frc_div      = document.getElementById("rownorm-toggler");
const dlt_check    = document.getElementById("delta-toggle");
const dlt_div      = document.getElementById("delta-toggler");
const bin_check    = document.getElementById("bin-toggle");
const bin_div      = document.getElementById("bin-toggler");
const bin_select   = document.getElementById("bin-picker");
const slider_p     = document.getElementById('slider-p');
const slider_theta = document.getElementById('slider-theta');
const string_p     = document.getElementById('string-p');
const string_theta = document.getElementById('string-theta');

const conf_plot_list = `
    <option value="con" class="conf">Confusion</option>
    <option value="det" class="conf">Detector confusion</option>
    <option value="abl" class="conf">Ablation confusion</option>
`;

const accu_plot_list = `
    <option value="acc" class="accu">Accuracy</option>
    <option value="abl_acc" class="accu">Ablation accuracy</option>
`;

const p_ranges = [
    '[0.5, 1.0] GeV', '[1.0, 1.5] GeV', '[1.5, 2.0] GeV', '[2.0, 2.5] GeV',
    '[2.5, 3.0] GeV', '[3.0, 3.5] GeV', '[3.5, 4.5] GeV'
];

const theta_ranges = [
    '[17°, 28°]', '[28°, 40°]',  '[40°, 60°]',   '[60°, 77°]',
    '[77°, 96°]', '[96°, 115°]', '[115°, 133°]', '[133°, 150°]',
];


function deltaSupported() {
    if (plot_select.value == "det")
        return false;
    if (plot_select.value == "abl" || plot_select.value == "abl_acc")
        return true;
    return wgt_check_is_on;
}

function fracSupported() {
    if (type_select.value == "accu")
        return false;
    if (deltaSupported() && dlt_check_is_on)
        return false;
    return true;
}

function binningSupported() {
    return (type_select.value != "accu");
}

function particleTypeSupported() {
    return (type_select.value == "accu");
}

function setVisibilities() {
    if (type_select.value == "wgt") {
        plot_div.style.display = "none";
        part_div.style.display = "none";
        wgt_div.style.display = "none";
        frc_div.style.display = "none";
        dlt_div.style.display = "none";
    } else {
        plot_div.style.display = "block";
        wgt_div.style.display = "block";
        part_div.style.display = particleTypeSupported() ? "block" : "none";
        frc_div.style.display = fracSupported() ? "block" : "none";
        dlt_div.style.display = deltaSupported() ? "block" : "none";
    }
    bin_div.style.display = binningSupported() ? "block" : "none";
}

function setImageSource() {
    let src = "pgun6/";

    if (wgt_check_is_on) 
        src += "wgt_";

    if (type_select.value == "wgt")
        src += "wgt";
    else
        src += plot_select.value;

    if (deltaSupported() && dlt_check_is_on)
        src += "_del";
    
    if (fracSupported() && frc_check_is_on)
        src += "_frc";

    if (particleTypeSupported())
        src += part_select.value;

    if (binningSupported() && bin_check_is_on)
        src += "_p" + slider_p.value + "_theta" + slider_theta.value;

    src += ".png";
    image.src = src; 
}


part_select.addEventListener("change", (event) => {
    setVisibilities();
    setImageSource();
})

plot_select.addEventListener("change", (event) => {
    setVisibilities();
    setImageSource();
});

type_select.addEventListener("change", (event) => {
    if (event.target.value == "conf") {
        plot_select.innerHTML = conf_plot_list;
    } else {
        plot_select.innerHTML = accu_plot_list;
    }
    plot_select.dispatchEvent(new Event('change'));
    setVisibilities();
    setImageSource();
});

let wgt_check_is_on = false;
wgt_check.addEventListener("input", (event) => {
    wgt_check_is_on = !(wgt_check_is_on);
    setVisibilities();
    setImageSource();
});

let frc_check_is_on = false;
frc_check.addEventListener("input", (event) => {
    frc_check_is_on = !(frc_check_is_on);
    setVisibilities();
    setImageSource();
});

let dlt_check_is_on = false;
dlt_check.addEventListener("input", (event) => {
    dlt_check_is_on = !(dlt_check_is_on);
    setVisibilities();
    setImageSource();
});

let bin_check_is_on = false;
bin_check.addEventListener("input", (event) => {
    bin_check_is_on = !(bin_check_is_on);
    if (bin_check_is_on) {
        bin_select.style.display = "block";
    } else {
        bin_select.style.display = "none";
    }
    setVisibilities();
    setImageSource();
});

slider_p.addEventListener('input', (event) => {
    string_p.innerHTML = `p: ${p_ranges[parseInt(event.target.value)]}`
    setImageSource();
});

slider_theta.addEventListener('input', (event) => {
    string_theta.innerHTML = `theta: ${theta_ranges[parseInt(event.target.value)]}`
    setImageSource();
});

