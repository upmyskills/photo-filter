const pathGenerator = new TimeOfDay();

const loader = document.querySelector('#loader');
const img = document.querySelector('img');
const filters = document.querySelector('.filters');
const btns = document.querySelector('.btn-container');
const fullSizeBtn = document.querySelector('.openfullscreen');
let filterParams = {};

const resetFilters = () => {
    filters.querySelectorAll('input').forEach(el => {
        el.value = el.getAttribute('value');
        updateFilterParams(el);
    });
}

const dropActiveClass = (event) => {
    const items = btns.querySelectorAll('.btn');
    if (event.target.classList.contains('btn')) {
        items.forEach(btn => btn.classList.remove('btn-active'));
        event.target.classList.add('btn-active');
    };
}

const loadingHandler = (path, element = null) => {
    if (element) {
        element.disabled = true;
        element.classList.add('btn-disabled');
    };

    img.src = '';
    img.classList.add('loading');
    loader.classList.add('loader');
    img.src = path;

    img.onload = () => {
        if (element) {
            element.disabled = false;
            element.classList.remove('btn-disabled');
        };

        img.classList.remove('loading');
        loader.classList.remove('loader');
    }
}

window.addEventListener('load', () => {
    loadingHandler('./assets/img/img.jpg');
    resetFilters();
});

fullSizeBtn.addEventListener('click', () => {
    (document.fullscreenElement) ? document.exitFullscreen() : document.documentElement.requestFullscreen();
});


filters.addEventListener('input', (e) => {
    const el = e.target;
    updateFilterParams(el);
    updateImgFilters();
});

btns.addEventListener('click', e => {
    dropActiveClass(e);

    if (e.target.innerHTML === 'Next picture') {
        const path = pathGenerator.next();
        const target = e.target;
        loadingHandler(path, target);
    };
    
    if (e.target.innerHTML === 'Reset') {
        resetFilters();
        updateImgFilters();
    };
    
    if (e.target.getAttribute('name') === 'upload') {
        console.log('Please choose img file!');
        e.target.value = '';
        
        e.target.addEventListener('change', e => {
            const file = e.target.files[0];
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const loadImg = new Image();
                loadImg.src = fileReader.result;
                const path = loadImg.src;
                loadingHandler(path);
            };
            if (file) fileReader.readAsDataURL(file);
        }, false);
    };

    if (e.target.innerHTML === 'Save picture') {
        getCanvasFromImg();
    };
});

const updateFilterParams = (e) => {
    const filterName = e.getAttribute('name');
    const filterSizing = e.getAttribute('data-sizing');
    const valueVisor = e.nextElementSibling;
    // const minValue = e.getAttribute('min');
    // const maxValue = e.getAttribute('max');
    const currentValue = e.value;
    valueVisor.innerHTML = currentValue;

    filterParams[`${filterName}`] = `${currentValue}${filterSizing}`; 
}

const updateImgFilters = () => {
    // console.log(`${filter} - ${value} - ${sizing}`);
    const addFilters = Object.keys(filterParams).map(filter => `--${filter}:${filterParams[filter]}`);
    img.style = addFilters.join(';');
}

const updateCanvasFilters = () => {
    const filtersToStr = Object.keys(filterParams).map(filter => {
        const name = (filter === 'hue') ? 'hue-rotate' : filter; 
        return `${name}(${filterParams[filter]})`;
    });
    // console.log(filtersToStr.join(' '));
    return filtersToStr.join(' ');
}

const getCanvasFromImg = () => {
    const canvas = document.createElement('canvas');
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = img.src;
    image.addEventListener('load', () => {
        const blur = parseInt(filterParams.blur);
        const imgWidth = parseInt(window.getComputedStyle(img).getPropertyValue('width'));
        const imgHeight = parseInt(window.getComputedStyle(img).getPropertyValue('height'));
        // console.log('Width:', imgWidth, 'vs', image.width);
        // console.log('Height:', imgHeight, 'vs', image.height);
        const kw = (imgWidth >= image.width) ? imgWidth/image.width : image.width/imgWidth;
        const kh = (imgHeight >= image.height) ? imgHeight/image.height : image.height/imgHeight;
        let k = (kw > kh) ? kw : kh;
        filterParams.blur = (k*blur).toFixed(2) + 'px';
        // console.log('filterParams: ', blur, filterParams);
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.filter = updateCanvasFilters();
        // updateImgFilters()
        ctx.drawImage(image, 0, 0);
        const url = canvas.toDataURL();
        downloadPic(url);
        filterParams.blur = blur;
    });
    canvas.delete;
}

const downloadPic = (data) => {
    // console.log('GOOF!');
    const link = document.createElement('a');
    link.download = 'image!.png';
    link.href = data;
    link.click();
    link.delete;
}