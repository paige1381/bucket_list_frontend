$( () => {

  // NAV
  const $menu = $('.menu');
  const $main = $('main');
  const $navIcon = $('.nav_icon');
  const $burgOne = $('.burg1');
  const $burgTwo = $('.burg2');
  const $burgThree = $('.burg3');
  const $post = $('.list-goal');
  const $close = $('.close-it');

  // NAV
  const openNav = () => {
    $menu.toggleClass('open');
    $burgOne.toggleClass('close');
    $burgTwo.toggleClass('close');
    $burgThree.toggleClass('close');
    $main.toggleClass('smaller');
  }

  // const jiggle = () => {
  //   $post(this).toggleClass('jiggle');
  // }

  //  NAV
  $navIcon.on('click', openNav)
  // $post.on('click', jiggle)
  $close.on('click', openNav)


const itemColors = [
  'rgb(255,216,195)',
  'rgb(238,216,195)',
  'rgb(221,216,195)',
  'rgb(204,216,195)'
]

const randomItemColor = () => {
  const random = Math.floor(Math.random() * 6)
  return itemColors[random];
}

console.log($post);

$('.list-goal').css('background-color', 'black');
}); // ENDS ONLOAD
