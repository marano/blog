(function(e,t,n){"use strict";var r,i=function(){var e=t(".rrssb-buttons li").length,n=100/e;t(".rrssb-buttons li").css("width",n+"%").attr("data-initwidth",n)},s=function(){var e=parseFloat(t(".rrssb-buttons").width()),n=t(".rrssb-buttons li").not(".small").first().width();n>170&&r<1?t(".rrssb-buttons").addClass("large-format"):t(".rrssb-buttons").removeClass("large-format");e<200?t(".rrssb-buttons").removeClass("small-format").addClass("tiny-format"):t(".rrssb-buttons").removeClass("tiny-format")},o=function(){var e=0,n=0,i,s;if(r===t(".rrssb-buttons li").length){var o=r*42,u=parseFloat(t(".rrssb-buttons").width());i=t(".rrssb-buttons li.small").first();s=parseFloat(t(i).attr("data-size"))+55;if(o+s<u){t(".rrssb-buttons").removeClass("small-format");t(".rrssb-buttons li.small").first().removeClass("small");a()}}else{t(".rrssb-buttons li").not(".small").each(function(r){var i=parseFloat(t(this).attr("data-size"))+55,s=parseFloat(t(this).width());e+=s;n+=i});var f=e-n;i=t(".rrssb-buttons li.small").first();s=parseFloat(t(i).attr("data-size"))+55;if(s<f){t(i).removeClass("small");a()}}},u=function(e){var n=t(".rrssb-buttons li").nextAll(),r=n.length;t(t(".rrssb-buttons li").get().reverse()).each(function(e){if(t(this).hasClass("small")===!1){var n=parseFloat(t(this).attr("data-size"))+55,i=parseFloat(t(this).width());if(n>i){var s=t(".rrssb-buttons li").not(".small").last();t(s).addClass("small")}a()}--r||o()});e===!0&&l(a)},a=function(){var e,n,o,u,a;r=t(".rrssb-buttons li.small").length;t(".smallbtnsdude span").html(r);if(r>0&&r!==t(".rrssb-buttons li").length){t(".rrssb-buttons").removeClass("small-format");t(".rrssb-buttons li.small").css("width","42px");o=r*42;e=t(".rrssb-buttons li").not(".small").length;n=100/e;a=o/e;navigator.userAgent.indexOf("Chrome")>=0||navigator.userAgent.indexOf("Safari")>=0?u="-webkit-calc("+n+"% - "+a+"px)":navigator.userAgent.indexOf("Firefox")>=0?u="-moz-calc("+n+"% - "+a+"px)":u="calc("+n+"% - "+a+"px)";t(".rrssb-buttons li").not(".small").css("width",u)}else if(r===t(".rrssb-buttons li").length){t(".rrssb-buttons").addClass("small-format");i()}else{t(".rrssb-buttons").removeClass("small-format");i()}s()},f=function(){i();t(".rrssb-buttons li .text").each(function(e){var n=parseFloat(t(this).width());t(this).closest("li").attr("data-size",n)});u(!0)},l=function(e){var n=t(".rrssb-buttons").width();r=t(".rrssb-buttons li.small").length;t(".rrssb-buttons li.small").removeClass("small");u();e()},c=function(t,r,i,s){var o=e.screenLeft!==n?e.screenLeft:screen.left,u=e.screenTop!==n?e.screenTop:screen.top,a=e.innerWidth?e.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width,f=e.innerHeight?e.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height,l=a/2-i/2+o,c=f/3-s/3+u,h=e.open(t,r,"scrollbars=yes, width="+i+", height="+s+", top="+c+", left="+l);e.focus&&h.focus()},h=function(){var e={};return function(t,n,r){r||(r="Don't call this twice without a uniqueId");e[r]&&clearTimeout(e[r]);e[r]=setTimeout(t,n)}}();t(".rrssb-buttons a.popup").on("click",function(e){var n=t(this);c(n.attr("href"),n.find(".text").html(),580,470);e.preventDefault()});t(e).resize(function(){l(a);h(function(){l(a)},200,"finished resizing")});t(document).ready(function(){f()})})(window,$);
