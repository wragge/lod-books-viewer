"use strict";var app=angular.module("lodBook",["ngSanitize","ngRoute","duScroll","mgcrea.ngStrap","lodBook.text","lodBook.people","lodBook.resources"]);app.config(["$routeProvider","$locationProvider",function(a,b){a.otherwise({redirectTo:"/text/1"}),b.hashPrefix("!")}]),app.factory("DataFactory",["$document","$filter",function(a,b){var c=function(a){var b=[];return angular.forEach(a,function(a){var c={};angular.forEach(a,function(a,b){c[b.replace(":","_")]=a}),b.push(c)}),b};console.log("Running DataFactory...");var d=[],e={},f=angular.element("#people-json")[0];d=d.concat(JSON.parse(f.innerHTML)["@graph"]);var g=angular.element("#resources-json")[0];return d=d.concat(JSON.parse(g.innerHTML)["@graph"]),d=c(d),e.getItem=function(a){var c=b("filter")(d,{"@id":a});return console.log(c),c[0]},e.getSubjectOf=function(a){var c=b("filter")(d,{schema_about:a});return c},e.getMentionsOf=function(a){var c=b("filter")(d,{schema_mentions:a});return c},e.getCreatorOf=function(a){var c=b("filter")(d,{schema_creator:a});return c},e.getPeople=function(){var a=b("filter")(d,{"@type":"schema:Person"});return a},e.getResources=function(){var a=b("filter")(d,{"@type":"schema:CreativeWork"});return a},e.getImages=function(a){var c=b("filter")(d,{"@type":"schema:CreativeWork",schema_about:a,schema_thumbnailUrl:""});return c},e.loading="Loading data from DataFactory...",e}]),app.factory("TextFactory",["$document","$filter",function(a,b){console.log("Running TextFactory...");var c,d,e={},f=[],g={},h={},i={},j="Another great LOD Book",k=1,l=1,m=0,n=0;angular.forEach(angular.element('[property="rdfs:label"]',angular.element("#content")),function(a){var b=angular.element(a).text(),c=angular.element(a).attr("about");g[b]=c,c in h?h[c].push(b):h[c]=[b]});var o=angular.element("#content").children();return angular.forEach(o,function(a){var b=a.tagName;if(b.match(/H1/))j=angular.element(a).text(),angular.forEach([": "," – "],function(a){var b=j.split(a);2===b.length&&(j=b[0],c=a,d=b[1])});else if(b.match(/H[2-6]{1}/)){var e=m,h=parseInt(b.substring(1),10);0!==m&&h<i[m].level&&(e=i[i[m].parent].parent),i[l]={parent:e,content:angular.element(a).html(),level:h,start:k},m=l,f.push({id:l,parent:m,type:"h",level:h,content:angular.element(a).html()}),l++}else{var o=angular.element(a).text(),p=0,q=[];o.length>0&&(p=o.match(/\s+/g).length),angular.forEach(g,function(b,c){var d=new RegExp(c);null!==d.exec(angular.element(a).text())&&q.push({label:c,link:b})}),f.push({id:k,parent:m,type:"p",content:angular.element(a).html(),links:q,words:p,wordsProgress:n}),n+=p,k++}}),o.remove(),e.getTitle=function(){return[j,c,d]},e.getText=function(){return f},e.getHeadings=function(){return i},e.getWords=function(){return n},e.getParas=function(){return b("filter")(f,{type:"p"})},e.getPara=function(a){return b("filter")(f,{type:"p",id:a})[0]},e.getLinks=function(a){return b("filter")(f,{type:"p",id:a})[0].links},e.getParaCount=function(){return b("filter")(f,{type:"p"}).length},e.getParaNumbers=function(){for(var a=[],b=e.getParaCount(),c=1;b>=c;c++)a.push(c);return a},e.getReferencesTo=function(a){h=[];var c=b("filter")(f,{type:"p",links:a});console.log(c),angular.forEach(c,function(c){var d=b("filter")(c.links,{link:a});console.log(d)})},e.loading="Loading data from TextFactory...",e}]),app.run(["TextFactory",function(a){console.log(a.loading)}]),app.run(["DataFactory",function(a){console.log(a.loading)}]),app.controller("AppCtrl",["$scope","$location","TextFactory",function(a,b,c){a.title=c.getTitle(),a.isActive=function(a){var c=new RegExp(a),d=c.exec(b.path());return d}}]);var app=angular.module("lodBook.text",["ngRoute","angular-inview","duScroll"]);app.config(["$routeProvider","$anchorScrollProvider",function(a,b){a.when("/text",{redirectTo:"/text/1"}),a.when("/text/:paraId",{templateUrl:"modules/text/views/read_para.html",controller:"ReadParaCtrl"}),b.disableAutoScrolling()}]),app.run(["$rootScope","$location","$document","$routeParams","$timeout",function(a,b,c,d,e){a.$on("$routeChangeSuccess",function(){e(function(){if(b.path().match(/text\/\d+/)){var a=parseInt(d.paraId,10);if(a>1){var e=angular.element(document.getElementById("para-"+a));c.scrollToElement(e,70)}}})})}]),app.controller("ReadCtrl",["$rootScope","$scope",function(a,b){b.headings=a.headings,b.text=a.text}]),app.controller("ReadParaCtrl",["$rootScope","$scope","$routeParams","$location","TextFactory","DataFactory",function(a,b,c,d,e,f){b.paraId=parseInt(c.paraId,10),b.currentParas={},b.activePara="",b.activeParaId="",b.wordsTotal=e.getWords(),b.text=e.getText(),b.gotoPara=function(){d.path("/text/"+b.gotoParaId)},b.paraInView=function(a,c,d,g){var h=g.inViewTarget.id.match(/para-(\d+)/)[1];c===!1?delete b.currentParas[h]:b.currentParas[h]={offset:g.inViewTarget.offsetTop,part:d};var i=1e5,j="",k="",l=[];return angular.forEach(b.currentParas,function(a,b){var c=e.getLinks(b);angular.forEach(c,function(a){var b=f.getItem(a);"undefined"!=typeof b&&-1===l.indexOf(b)&&l.push(b)}),("top"===a.part||"both"===a.part)&&a.offset<i&&(i=a.offset,j=e.getPara(b),k=b)}),console.log(k),b.activePara=j,b.activeParaId=k,b.currentLinks=l,b.paraCount=e.getParaCount(),b.paraNumbers=e.getParaNumbers(),b.gotoParaId=b.paraNumbers[k-1],!1}}]),app.directive("makeHeading",function(){return{restrict:"E",scope:{heading:"="},template:'<a href="#!/read/p/{{ heading.start }}"><h1 ng-if="heading.level==1">{{ heading.content }}</h1><h2 ng-if="heading.level==2">{{ heading.content }}</h2><h3 ng-if="heading.level==3">{{ heading.content }}</h3></a>'}});var app=angular.module("lodBook.people",["ngRoute"]);app.config(["$routeProvider",function(a){a.when("/people",{templateUrl:"modules/people/views/people.html",controller:"PeopleCtrl"}),a.when("/people/:personId",{templateUrl:"modules/people/views/person.html",controller:"PersonCtrl"})}]),app.controller("PeopleCtrl",["$scope","DataFactory",function(a,b){a.people=b.getPeople()}]),app.controller("PersonCtrl",["$scope","$routeParams","DataFactory","TextFactory",function(a,b,c,d){var e=function(a,b){return Math.floor(Math.random()*(b-a+1)+a)},f=b.personId;a.person=c.getItem(f);var g=c.getImages(f);if(g.length>1){var h=e(0,g.length-1);a.imageObject=g[h]}else 1===g.length&&(a.imageObject=g[0]);a.subjectOf=c.getSubjectOf(f),a.mentionsOf=c.getMentionsOf(f),a.creatorOf=c.getCreatorOf(f),a.referencesTo=d.getReferencesTo(f),console.log(a.referencesTo)}]);var app=angular.module("lodBook.resources",["ngRoute"]);app.config(["$routeProvider",function(a){a.when("/resources",{templateUrl:"modules/resources/views/resources.html",controller:"ResourcesCtrl"}),a.when("/resources/:resourceId",{templateUrl:"modules/resources/views/resource.html",controller:"ResourceCtrl"})}]),app.controller("ResourcesCtrl",["$scope","$filter","DataFactory",function(a,b,c){var d=c.getResources();console.log(d),a.resources=b("orderBy")(d,"schema_name")}]),app.controller("ResourceCtrl",["$scope","$routeParams","$filter","DataFactory",function(a,b,c,d){var e=b.resourceId;a.resource=d.getItem("/resources/"+e)}]);