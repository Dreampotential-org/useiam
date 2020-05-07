

 patientlist=[
    {image:"images/images5.jpg",name:"Test"},
    {image:"images/image1.jpg",name:"Test"},
    {image:"images/image2.jpg",name:"Test"},
    {image:"images/user.png",name:"Test"},
    {image:"images/image3.jpg",name:"Test"},
    {image:"images/user.png",name:"Test"},
    {image:"images/images4.jpg",name:"Test"},
    {image:"images/user.png",name:"Test"},


]

// Get the div you want to add element to
var rigDiv = $("#rig");

// Loop through images and add them to target div
for(var image of patientlist){
    var element = '<div class="col-4 col-md-2" style="margin:10px;"><div style="border: 1px solid lightgrey;text-align: center;    border-radius: 10px;"><div style="width: 100;height: 200px;margin: 0 auto; overflow: hidden;    border-top-left-radius: 10px;border-top-right-radius: 10px;"><img style="width: 100%; height:auto" src="' + image.image + '" /></div> <div style="text-align: initial;padding: 10px;font-size: 17px;font-weight: 700;"><p>'+ image.name +'</p></div></div></div>'
    rigDiv.append(element);
}
// for(var image of patientlist){
//     var element = '<div class="col-2 col-md-2" style="margin:10px;"><div style="padding: 10px;border: 1px solid lightgrey;text-align: center;"><div style="width: 100%;height: 200px;margin: 0 auto; overflow: hidden;"><img style="width: auto; height:100%" src="' + image.image + '" /></div> <div style="text-align:center"><p>'+ image.name +'</p></div></div></div>'
//     rigDiv.append(element);
// }