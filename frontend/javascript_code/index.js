const sidebarTabs = $$('.js__sidebar-tabs')

sidebarTabs.forEach((tab, index) => {
    tab.onclick = function(){
      $('.js__sidebar-tabs.sidebar__item--active').classList.remove('sidebar__item--active');
                tab.classList.add('sidebar__item--active');
                containerPanes[0].style.display = "none";
                containerPanes[1].style.display = "none";
                containerPanes[2].style.display = "none";
                containerPanes[index].style.display = "block";
    }
  
  })