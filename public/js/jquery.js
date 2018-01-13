$( () => {

  // NAV
  const $menu = $('.menu');
  const $main = $('main');
  const $navIcon = $('.nav_icon');
  const $burgOne = $('.burg1');
  const $burgTwo = $('.burg2');
  const $burgThree = $('.burg3');
  // const $post = $('.list-goal');

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

}); // ENDS ONLOAD
