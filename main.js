const image        = document.getElementById("image");
const dset_select  = document.getElementById("dset-select");
const dset_div     = document.getElementById("dset-picker");
const plot_select  = document.getElementById("plot-select");
const plot_div     = document.getElementById("plot-picker");
const type_select  = document.getElementById("img-type-select");
const part_select  = document.getElementById("part-select");
const part_div     = document.getElementById("particle-type");
const det_select   = document.getElementById("det-select");
const det_div      = document.getElementById("detector-type");
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
    `,

    'upcoming':`
        <option value="maxLikelihood"     class="upcoming">Max detector likelihoods</option>
        <option value="likelihoodDiff"    class="upcoming">Difference between largest detector likelihoods</option>
        <option value="KCDCLikelihood"    class="upcoming">CDC's K likelihoods for true K, all bins</option>
        <option value="piDetLikelihoods"  class="upcoming">All detector likelihoods for true pi, one bin</option>
        <option value="mostConfusedByDet" class="upcoming">Each detector's top incorrect ID for true pions</option>
        <option value="leadingWrong"      class="upcoming">Most frequent incorrect particle types</option>
        <option value="CDCdisagree"       class="upcoming">Detectors that are most often wrong when CDC is right</option>
    `,

    'alex':`
        <option value="maxLikelihood"      class="upcoming">Max detector likelihoods</option>
        <option value="likelihoodDiff"     class="upcoming">Difference between largest detector likelihoods</option>
        <option value="detTrueLikelihoods" class="upcoming">Detector's likelihood ratios for the true particle hypothesis, all bins</option>
        <option value="partDetLikelihood"  class="upcoming">All detector likelihoods for each true particle type per bin</option>
        <option value="mostConfusedByDet"  class="upcoming">Each detector's top incorrect ID for true particle type</option>
        <option value="leadingWrong"       class="upcoming">Most frequent incorrect particle types</option>
        <option value="detDisagreement"    class="upcoming">Detectors that are most often wrong when another detector is right</option>
    `
 };

const upcoming_plot_info = {
    "maxLikelihood": {
        "title": "Maximum detector likelihood ratio values",
        "desc": `
            We have a six-by-six grid of subplots. Each row corresponds to a
            <b>particle hypothesis</b> and each column to a <b>detector</b>. The
            subplots then show a histogram of the corresponding detector's 
            likelihood ratios for the corresponding hypothesis. These values are
            colored by whether that hypothesis is, in fact, correct. For
            example, when looking at the CDC/e subplot, we see two histograms.
            Both give the distribution of the CDC's electron likelihood ratios;
            however, the blue gives this distribution over true electrons and
            the orange gives this distribution over all other true particle
            types. Note that this plot shows the data only over a specific (p,
            theta) bin; in the future, such a plot could be made in every bin
            and the sliders could be used to choose a bin.
        `
    },
    "likelihoodDiff": {
        "title": "Per detector and hypothesis, difference between two largest likelihood ratios",
        "desc": `
            We again have a six-by-six grid of subplots. Each row corresponds to
            a <b>true particle sample</b> and each column to a <b>detector</b>. 
            Each subplot then shows the distribution of the difference between
            the largest and second largest likelihood ratios for the given
            detector.  These are colored by whether the largest likelihood ratio
            corresponds to the correct hypothesis or not. For example, the CDC/e
            subplot contains two histograms. The blue one shows the distribution
            of P(e) minus P(2), where "2" is whatever hypothesis gave the second
            largest likelihood ratio. The orange one shows the distribution of
            P(1) minus P(2) where "1" is the hypothesis for the largest
            likelihood ratio (which is <i>not</i> e) and "2" is the hypothesis
            for the second largest likelihood ratio. Note that this plot is made
            only in one (p, theta) bin; in the future, it could be made in every
            (p, theta) bin.
        `,
    },
    "KCDCLikelihood": {
        "title": "Distribution of the CDC kaon likelihood ratio in each (p, theta) bin for true kaons", 
        "desc": `
            Here we have a seven-by-eight grid of subplots. Each row corresponds
            to a <b>momentum bin</b> in GeV and each column to a <b>theta
            bin</b> in degrees. Each subplot shows the distribution in the 
            corresponding (p, theta) bin of the CDC's kaon likelihood ratios for
            true kaons, colored by whether the particle was correctly or
            incorrectly identified. In principle, this plot could be made for
            every combination of detector and particle type.
        `
    },
    "piDetLikelihoods": {
        "title": "All detector likelihood ratios for true pion sample", 
        "desc": `
            We have a six-by-six grid of subplots. Each row corresponds to a
            <b>particle hypothesis</b> and each column to a <b>detector</b>.
            Each subplot then shows the distribution of the corresponding
            detector's likelihood ratios for the corresponding hypothesis. The
            histograms are colored by whether the likelihood ratio is the
            largest of that detector's likelihood ratios for the event. For
            example, when looking at the TOP/mu plot, we see two histograms. The
            blue one shows the distribution of the TOP's muon likelihood ratios
            when muon has the largest likelihood ratio of the particle types
            (even though we are only looking at pions). The orange one shows the
            distribution of the TOP's muon likelihood ratios when muons do not
            have the largest likelihood ratio. Note that this plot is only made
            in one (p, theta) bin; in the future, it could be made for every (p,
            theta) bin and every true particle type, selectable through sliders
            and dropdown menus.
        `
    },
    "mostConfusedByDet": {
        "title": "Top incorrect PID for true pions", 
        "desc": `
            Here we have six subplots; one for each detector. Each subplot shows
            the particle in each (p, theta) bin which was the most common
            incorrectly chosen particle type by the corresponding detector for a
            sample of true pions. The percentage shown in the cell gives how
            frequently that particle type was chosen for true pions that were
            incorrectly identified by the corresponding detector. A value of
            "all" indicates that there was little data in the region; the most
            common incorrect identification was when the detector had no
            information to contribute at all. While this plot is made only for
            true pions, similar plots could be made for all the particle types.
        `
    },
    "leadingWrong": {
        "title": "Most frequent incorrect particle types", 
        "desc": `
            We have six subplots: one for each true particle type. Each subplot
            then shows the most common incorrectly chosen particle type for the
            (p, theta) bin and true particle type. (This is indicated by color.)
            In each cell, a detector and frequency is also given. This detector 
            was the detector which most frequently predicted the incorrect
            particle type. The frequency gives the actual percentage of
            incorrectly identified events in that bin which the detector chose
            that particle type.
        `
    },
    "CDCdisagree": {
        "title": "Detectors that are most often wrong when the CDC is right and the ensemble is wrong", 
        "desc": `
            Here we have six subplots: one for each true particle type. For this
            study, we consider specifically the events for which the particle
            type predicted by the ensemble of detectors is incorrect <b>but the
            CDC was correct</b>. For each subplot, we show the detector which
            was most frequently incorrect, as well as that frequency at which 
            they were incorrect as a function of momentum and theta.
        `
    }
};

const p_ranges = [
    '[0.5, 1.0] GeV', '[1.0, 1.5] GeV', '[1.5, 2.0] GeV', '[2.0, 2.5] GeV',
    '[2.5, 3.0] GeV', '[3.0, 3.5] GeV', '[3.5, 4.5] GeV'
];

const theta_ranges = [
    '[17°, 28°]', '[28°, 40°]',  '[40°, 60°]',   '[60°, 77°]',
    '[77°, 96°]', '[96°, 115°]', '[115°, 133°]', '[133°, 150°]',
];

const part_select_options = {
    "default": `
        <option value="">All</option>
        <option value="_e">Electron</option>
        <option value="_mu">Muon</option>
        <option value="_pi">Pion</option>
        <option value="_K">Kaon</option>
        <option value="_p">Proton</option>
        <option value="_d">Deuteron</option> 
    `,
    "modified": `
        <option value="_e">Electron</option>
        <option value="_mu">Muon</option>
        <option value="_pi">Pion</option>
        <option value="_K">Kaon</option>
        <option value="_p">Proton</option>
        <option value="_d">Deuteron</option> 
    `
};

let wgt_check_is_on = false;
let frc_check_is_on = false;
let dlt_check_is_on = false;
let bin_check_is_on = false;
let correct_passwd = false;

function loadURL() {
    const url = new URL(window.location);
    const sp = url.searchParams;

    if (!sp.has('type') || (!correct_passwd && sp.get('dset') != 'pgun6')) {
        dset_select.value = "pgun6";
        type_select.value = "conf";
        plot_select.innerHTML = plot_lists[type_select.value];
        plot_select.value = "con";
        part_select.value = "";
        det_select.value  = "";
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

    dset_select.value = sp.get('dset');
    type_select.value = sp.get('type');
    plot_select.innerHTML = plot_lists[type_select.value];
    plot_select.value = sp.get('plot');
    part_select.value = sp.get('part');
    det_select.value  = sp.get('det');
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

function weightSupported() {
    if (dset_select.value == "pgun6_bothcharge")
        return false;
    return true;
}

function deltaSupported() {
    if (type_select.value == "conf") {
        if (plot_select.value == "con")
            return wgt_check_is_on;
        else if (plot_select.value == "det")
            return (frc_check_is_on || wgt_check_is_on);
        else
            return true;
    }
    else if (type_select.value == "accu")
        return (plot_select.value != "acc" || wgt_check_is_on);
    else
        return false;
}

function fracSupported() {
    if (type_select.value != "conf")
        return false;
    return true;
}

function detSupported() {
    if (type_select.value == "alex") {
        if (plot_select.value == "maxLikelihood") return false;
        if (plot_select.value == "likelihoodDiff") return false;
        if (plot_select.value == "leadingWrong") return false;
        if (plot_select.value == "mostConfusedByDet") return false;
        if (plot_select.value == "partDetLikelihood") return false;
        return true;
    }
    return false;
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
        if (plot_select.value == "blfreq" && part_select.value != "")
            return false;
    }
    if (type_select.value == "upcoming")
        return false;
    if (type_select.value == "alex") {
        if (plot_select.value == "detDisagreement") return false;
        if (plot_select.value == "leadingWrong") return false;
        if (plot_select.value == "mostConfusedByDet") return false;
        if (plot_select.value == "detTrueLikelihoods") return false;
        return true;
    }
    return true;
}

function particleTypeSupported() {
    if (type_select.value == "accu") return true;
    if (plot_select.value == "blame") return true;
    if (plot_select.value == "blfreq") return !bin_check_is_on;
    if (type_select.value == "alex") {
        if (plot_select.value == "maxLikelihood")   return false;
        if (plot_select.value == "likelihoodDiff")  return false;
        if (plot_select.value == "detDisagreement") return false;
        if (plot_select.value == "leadingWrong")    return false;
        return true;
    }
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
        wgt_div.style.display = weightSupported() ? "block" : "none";
        part_div.style.display = particleTypeSupported() ? "block" : "none";
        frc_div.style.display = fracSupported() ? "block" : "none";
        dlt_div.style.display = deltaSupported() ? "block" : "none";
    }
    corr_div.style.display = correctnessSupported() ? "block" : "none";
    ctrb_div.style.display = contribSplitSupported() ? "block" : "none";
    bin_div.style.display = binningSupported() ? "block" : "none";
    bin_select.style.display = (binningSupported() && bin_check_is_on) ? "block" : "none";
    det_div.style.display = (detSupported()) ? "block": "none";

    for (const el of document.getElementsByClassName("noblame"))
        el.disabled = (plot_select.value == "blame_bypart");

    if (type_select.value == "upcoming") {
        document.getElementById("plot-title").style.display = "block";
        document.getElementById("plot-desc").style.display = "block";
        document.getElementById("plot-title").innerHTML = upcoming_plot_info[plot_select.value]["title"];
        document.getElementById("plot-desc").innerHTML = upcoming_plot_info[plot_select.value]["desc"];
    } else {
        document.getElementById("plot-title").style.display = "none";
        document.getElementById("plot-desc").style.display = "none";
        if (plot_select.value == "leadingWrong")    return false;
    }

    part_select.innerHTML = part_select_options[ (type_select.value == "alex") ? "modified" : "default" ];
}

function setImageSource() {
    let src = dset_select.value + "/";

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
    
    if (detSupported())
        src += det_select.value;

    if (binningSupported() && bin_check_is_on)
        src += "_" + slider_p.value + "_" + slider_theta.value;

    src += ".png";
    image.src = src; 
}

function setURL() {
    let sp = new URLSearchParams();
    sp.set('dset', dset_select.value);
    sp.set('type', type_select.value);
    sp.set('plot', plot_select.value);
    sp.set('part', part_select.value);
    sp.set('det',  det_select.value);
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

dset_select.addEventListener("change", update);
part_select.addEventListener("change", update);
plot_select.addEventListener("change", update);
corr_select.addEventListener("change", update);
ctrb_select.addEventListener("change", update);
det_select.addEventListener("change", update);

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

function askPass() {
    let response = prompt('Enter password');
    if (response == "pnnl") {
        dset_div.style.display = "block";
        correct_passwd = true;
    }
    return false;
}
