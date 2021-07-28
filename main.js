const image        = document.getElementById("image");
const plot_select  = document.getElementById("plot-select");
const plot_div     = document.getElementById("plot-picker");
const type_select  = document.getElementById("img-type-select");
const part_select  = document.getElementById("part-select");
const part_div     = document.getElementById("particle-type");
const corr_select  = document.getElementById("correct-select");
const corr_div     = document.getElementById("correct-type");
const ctrb_select  = document.getElementById("contrib-select");
const ctrb_div     = document.getElementById("contrib-type");
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

const plot_lists = { 
    'conf':`
        <option value="con" class="conf">Confusion</option>
        <option value="det" class="conf">Detector confusion</option>
        <option value="abl" class="conf">Ablation confusion</option>
    `,

    'accu':`
        <option value="acc" class="accu">Accuracy</option>
        <option value="det" class="accu">Detector accuracy</option>
        <option value="abl" class="accu">Ablation accuracy</option>
    `,

    'llrs':`
        <option value="all" class="llrs">All event likelihood ratios</option>
        <option value="max" class="llrs">Maximum event likelihood ratios</option>
    `,

    'nums':`
        <option value="nosplit" class="nums">No split</option>
        <option value="bypart"  class="nums">Split by particle</option>
    `,

    'ctrb':`
        <option value="ctrb"   class="ctrb">Contributions</option>
        <option value="blfreq" class="ctrb">Blame frequency</option>
        <option value="blfreq_bypart" class="ctrb">Blame frequency by particle type</option>
        <option value="blame"  class="ctrb">Blame</option>
        <option value="blame_bypart"  class="ctrb">Blame by particle type</option>
    `
 };

const p_ranges = [
    '[0.5, 1.0] GeV', '[1.0, 1.5] GeV', '[1.5, 2.0] GeV', '[2.0, 2.5] GeV',
    '[2.5, 3.0] GeV', '[3.0, 3.5] GeV', '[3.5, 4.5] GeV'
];

const theta_ranges = [
    '[17°, 28°]', '[28°, 40°]',  '[40°, 60°]',   '[60°, 77°]',
    '[77°, 96°]', '[96°, 115°]', '[115°, 133°]', '[133°, 150°]',
];

let wgt_check_is_on = false;
let frc_check_is_on = false;
let dlt_check_is_on = false;
let bin_check_is_on = false;

function loadURL() {
    const url = new URL(window.location);
    const sp = url.searchParams;
    if (!sp.has('type')) {
        type_select.value = "conf";
        plot_select.innerHTML = plot_lists[type_select.value];
        plot_select.value = "con";
        part_select.value = "";
        corr_select.value = "right";
        ctrb_select.value = "_bycor";
        wgt_check_is_on = false;
        frc_check_is_on = false;
        dlt_check_is_on = false;
        bin_check_is_on = false;
        slider_p.value = 0;
        slider_theta.value = 0;
        setVisibilities();
        setImageSource();
        return;
    }

    type_select.value = sp.get('type');
    plot_select.innerHTML = plot_lists[type_select.value];
    plot_select.value = sp.get('plot');
    part_select.value = sp.get('part');
    corr_select.value = sp.get('corr');
    ctrb_select.value = sp.get('ctrb');
    wgt_check_is_on = (sp.get('wgt') == "true");
    frc_check_is_on = (sp.get('frc') == "true");
    dlt_check_is_on = (sp.get('dlt') == "true");
    bin_check_is_on = (sp.get('bin') == "true");
    slider_p.value = sp.get('pslider');
    slider_theta.value = sp.get('tslider');

    wgt_check.checked = wgt_check_is_on;
    frc_check.checked = frc_check_is_on;
    dlt_check.checked = dlt_check_is_on;
    bin_check.checked = bin_check_is_on;

    setVisibilities();
    setImageSource();
}


function deltaSupported() {
    if (type_select.value == "conf")
        return (plot_select.value == "abl" || wgt_check_is_on);
    else if (type_select.value == "accu")
        return (plot_select.value != "acc");
    else
        return false;
}

function fracSupported() {
    if (type_select.value != "conf")
        return false;
    if (deltaSupported() && dlt_check_is_on)
        return false;
    return true;
}

function binningSupported() {
    if (type_select.value == "accu")
        return false;
    if (type_select.value == "nums")
        return false;
    if (type_select.value == "ctrb") {
        if (plot_select.value == "blame")
            return false;
        if (plot_select.value == "blame_bypart")
            return false;
    }
    return true;
}

function particleTypeSupported() {
    if (type_select.value == "accu") return true;
    if (plot_select.value == "blame") return true;
    if (plot_select.value == "blfreq") return !bin_check_is_on;
    return false;
}

function correctnessSupported() {
    return (type_select.value == "llrs") || (type_select.value == "nums") || (plot_select.value == "blame_bypart");
}

function contribSplitSupported() {
    return (plot_select.value == "ctrb");
}

function setVisibilities() {
    if (type_select.value == "wgts") {
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
    corr_div.style.display = correctnessSupported() ? "block" : "none";
    ctrb_div.style.display = contribSplitSupported() ? "block" : "none";
    bin_div.style.display = binningSupported() ? "block" : "none";
    bin_select.style.display = (binningSupported() && bin_check_is_on) ? "block" : "none";

    for (const el of document.getElementsByClassName("noblame"))
        el.disabled = (plot_select.value == "blame_bypart");
}

function setImageSource() {
    let src = "pgun6/";

    src += type_select.value;
    if (type_select.value == "wgts") {
        if (bin_check_is_on)
            src += "_" + slider_p.value + "_" + slider_theta.value;
        src += ".png";
        image.src = src;
        return;
    }

    src += "_" + plot_select.value;

    if (contribSplitSupported())
        src += ctrb_select.value;
    
    if (correctnessSupported())
        src += "_" + corr_select.value;

    if (wgt_check_is_on)
        src += "_wgt";

    if (deltaSupported() && dlt_check_is_on)
        src += "_delta";

    if (fracSupported() && frc_check_is_on)
        src += "_norm";

    if (particleTypeSupported())
        src += part_select.value;

    if (binningSupported() && bin_check_is_on)
        src += "_" + slider_p.value + "_" + slider_theta.value;

    src += ".png";
    image.src = src; 
}

function setURL() {
    let sp = new URLSearchParams();
    sp.set('type', type_select.value);
    sp.set('plot', plot_select.value);
    sp.set('part', part_select.value);
    sp.set('corr', corr_select.value);
    sp.set('ctrb', ctrb_select.value);
    sp.set('wgt', wgt_check_is_on);
    sp.set('frc', frc_check_is_on);
    sp.set('dlt', dlt_check_is_on);
    sp.set('bin', bin_check_is_on);
    sp.set('pslider', slider_p.value);
    sp.set('tslider', slider_theta.value);
    window.history.pushState('', document.title, '?' + sp.toString())
}

function update(event) {
    setVisibilities();
    setImageSource();
    setURL();
}

part_select.addEventListener("change", update);
plot_select.addEventListener("change", update);
corr_select.addEventListener("change", update);
ctrb_select.addEventListener("change", update);

type_select.addEventListener("change", (event) => {
    plot_select.innerHTML = plot_lists[event.target.value];
    plot_select.dispatchEvent(new Event('change'));
    setVisibilities();
    setImageSource();
    // update(event);
});

wgt_check.addEventListener("input", (event) => {
    wgt_check_is_on = !(wgt_check_is_on);
    update(event);
});

frc_check.addEventListener("input", (event) => {
    frc_check_is_on = !(frc_check_is_on);
    update(event);
});

dlt_check.addEventListener("input", (event) => {
    dlt_check_is_on = !(dlt_check_is_on);
    update(event);
});

bin_check.addEventListener("input", (event) => {
    bin_check_is_on = !(bin_check_is_on);
    if (bin_check_is_on) {
        bin_select.style.display = "block";
    } else {
        bin_select.style.display = "none";
    }
    update(event);
});

slider_p.addEventListener('input', (event) => {
    string_p.innerHTML = `p: ${p_ranges[parseInt(event.target.value)]}`
    setImageSource();
    setURL();
});

slider_theta.addEventListener('input', (event) => {
    string_theta.innerHTML = `theta: ${theta_ranges[parseInt(event.target.value)]}`
    setImageSource();
    setURL();
});

window.onpopstate = (event) => {
    loadURL();
};
