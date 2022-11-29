$(function() {
    var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  var brand_data = JSON.parse($('#brand-data').text());
  brand_data.sort(function(a, b) {
    if (a.name_en < b.name_en) return -1;
    if (a.name_en > b.name_en) return 1;
    return 0;
  })
  
  function addItem(data, item) {
      data += '<div class="brand-item">';
      data += '<a href="'+item.url+'">';
      data += '<p class="brand-name-en">' + item.name_en + '</p>';
      data += '<p class="brand-name-jp">' + item.name_jp + '</p>';
      data += '</a>';
      data += '</div>';
    return data;
  }

  var pickups = [];
  var others = [];
  var brands = {};
  brand_data.forEach(function(item) {
      if (item.pickup == "true") {
          pickups.push(item)
      } else {
          if (letters.indexOf(item.group) != -1) {
              if (!brands[item.group]) {
                  brands[item.group] = [];
              }
              brands[item.group].push(item);
          } else {
              others.push(item);
          }

      }
  })
  brands.other = others;

  function setPickup() {
      items = '';
      output = '';
      pickups.forEach(function(item, index) {
          items = addItem(items, item);
      })
      output += '<div id="brand-pickup-group" class="brand-group">';
      output += '<p class="brand-current-group">Pickup Brands</p>';
      output += '<div class="brand-list">';
      output += items;
      output += '</div>';
      output += '</div>';
      $('#brand-pickup').html(output);
  }
  setPickup();

  function setBrands(e) {
      var output = '';
      var search = '';
      var search_count = 0;
      if (e) {
          search = e.target.value.toUpperCase().replace(/\s/g, "");
      }
      if (search) {
          output += '<div class="brand-search">';
          output += '<p class="brand-search-title">検索結果 (<span class="js-search-count">' + search_count + '</span>件)</p>';
          output += '<div class="brand-list">';
          for (var key in brands) {
              // skip loop if the property is from prototype
              if (!brands.hasOwnProperty(key)) continue;

              var obj = brands[key];
              obj.forEach(function(item) {
                  var simpleTitle = item.name_en.toUpperCase().replace(/\s/g, "");
                  if (simpleTitle.indexOf(search) == -1) return;
                  search_count++;
                  output = addItem(output, item);
              })
          }
          output += '</div>';
          output += '</div>';
      } else {
          for (var key in brands) {
              // skip loop if the property is from prototype
              if (!brands.hasOwnProperty(key)) continue;

              var items = '';
              var obj = brands[key];
              if (obj.length) {
                obj.forEach(function(item) {
                    items = addItem(items, item);
                })
                output += '<div id="brand-'+key+'" class="brand-group">';
                if (key == 'other') {key = '#';}
                output += '<p class="brand-current-group">' + key + '</p>';
                output += '<div class="brand-list">';
                output += items;
                output += '</div>';
                output += '</div>';
                $('.brand-filter-list li').each(function(){
                    var brandKey = $(this).find('a').html();
                    if(brandKey == key ){
                    $(this).addClass('is-show')
                    }
                })
              }
          }
      }
      $('#brand-wrapper').html(output);
      $('.js-search-count').text(search_count);
  }
  setBrands();
  $('.js-search').on('input', setBrands);
})
