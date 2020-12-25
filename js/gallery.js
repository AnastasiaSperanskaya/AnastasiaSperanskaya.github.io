var photos = [
    'img/espresso.png',
    'img/latte.png',
    'img/frappe.png',
    'img/takeaway.png',
    'img/americano.png'
]

var thumbnails = document.querySelectorAll('.gallery__photo-preview');
var fullPhoto = document.querySelector('.full-photo');

var addThumbnailsClickHandler = function (thumbnail, photo) {
    thumbnail.addEventListener('click', function () {
        fullPhoto.src = photo
    })};

for(var i = 0; i < thumbnails.length; i++) {
    addThumbnailsClickHandler(thumbnails[i], photos[i]);
}