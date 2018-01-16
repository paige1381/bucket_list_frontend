$( () => {

  // NAV
  const $menu = $('.menu');
  const $main = $('main');
  const $navIcon = $('.nav_icon');
  const $burgOne = $('.burg1');
  const $burgTwo = $('.burg2');
  const $burgThree = $('.burg3');
  const $close = $('.close-it');
  const $edit = $('.image-cont');
  const $editModal = $('.edit-modal');

  // NAV
  const openNav = () => {
    $menu.toggleClass('open');
    $burgOne.toggleClass('close');
    $burgTwo.toggleClass('close');
    $burgThree.toggleClass('close');
    $main.toggleClass('smaller');
  }

  const showEdit = () => {
    $editModal.css('display', 'block')
  }

  // const jiggle = () => {
  //   $post(this).toggleClass('jiggle');
  // }

  //  NAV
  $navIcon.on('click', openNav)
  // $post.on('click', jiggle)
  $close.on('click', openNav)
  $edit.on('click', showEdit)


}); // ENDS ONLOAD
