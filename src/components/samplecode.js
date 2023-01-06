import { useEffect, useRef, useState } from "react";

export default function PdfViewerComponent(props) {
    const containerRef = useRef(null);
	const instanceRef = useRef(null);
	const PSPDFKitRef = useRef(null);
	const [state, setState] = useState(null);

	

    useEffect(() => {
		const container = containerRef.current;
		let instance, PSPDFKit;

        (async function () {
            const downloadButton = {
                type: "content-editor",
                id: "save-pdf",
                icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAFLElEQVR4nO2bXWxURRTHf2fvbQndPiqJkBiCSKpWEYpEPqpg1aC2QUxqQmIb4gPxI5rAgwiET5GiiY0PRA2JqXRNMPIg8hENERDQqkDkgaJBwDdqKG9aiF165/iw29BA987s7t3bJe4vuQ+ze3bu/549M2fm7CxUqFChQoX/L+JqePcb2qLKSuARIFk6SaFcV7goQioY5MO+HXKt2A6dHDD5dd0qyupibxYlAr+K4ZmLn0h/kf2EM/U1bUHZC6RFWJdI8Pm57dJ3i92rqgAXPhYZrV0oI/t5oFWrB+9gcMTbvao0FeOEhM3AC1jpGfAM689/JO+P9vAAWZuc7UIZ2c/Z3ZIebnuGXs9Q7yuH7nlFJxTav90ByixPIaF0W+zwNHe7UHL1G6R5wlfOeEr9OMPR+5brXYX0b3WAb6j1Dfy+Q/6y2OGb3O1CydXvhS65Un2dJt9wxjfUVRkONxTgBJcIcPom444AgNNdcsULaPLgjKfUmaH8nRClA/o8hYaXdX62fXlkuxBmLtPG7P0vj2wnlEvDNqe75EowyJOe0utBnQxx8KE29znBOkM/uiwzC//8WfhsPmeZdii87XrjYlCl45edsmbka3PbdIJJcAihHqU3YWjqSdmzQ2QR8PdVNniGbcORUKLrkqd0DFxj483370lJf8LQlI2EehJ8M6dVx9t0WyPgsbZMBBxLFZfP42Jum07w4SdgisKa4ynpCLOPLALKhZ6U9HvKm56Cr7xks/etBrfRww9TJXyvmdQ51WZrdUA+q7lFSzUWd327K3w4HkzJ1UVLFaDa1pfdAXk8UjkNFVct9iGQRwQc+KJ8JkpX3ZFGQDkRWQREsaMbC1x1R5YFWlu12g94B2gDCtqZOdCnQipIsH73bkmHGbrqjmwIjBtiM/CWm3XBTERZVWVQCK9QxT4EPEMbQALmdX0tPW6fyo/2JTpfDMeBdmwOcNQd5W5woqdQqocH6P5Kfsjqmeigx0l3ZGkwiuJHlPeJPQ3mky5X/aiLBVaoMCv70kkCOt9rlH1x6ylZRSgXm47qtmTAnpqAx5NDJLPXgqSyd/MxfTduPS41QadwcrHrPKyLa5VVSQM5rjUfHNHmuPRAzENgvLJCAqvZSmB/HHog2jRopTagwWp0Y14ouR6IOQKSbqJCe4o9AqJMO7WGU6ossJidiksPxD0HBHQmsDhA6IxLD8ScBhtbZF9NwNZkAKNeQ2yZ1ywH4tIDMadBgBnPy9oaQ0vScCRpGMheh2sCmh9eIuvi1jMmK8FpL8h+QlJdnHpiTYNRcFunwSiIPw26dpS12z6nxKXxPPVY7WwG5TYEXBmzIbD8RGlL4ztmu0VYZOuAPNJOn2/g04bCzwPY6Jqpjb4BP7hxPiBET+xpsJvM+YDjOxtKOA0oCOHnlbJ6nIhsDhj/LxvSmV/i2sFesyuQS0B3dfrW8wE3E/vvAi+elTSZSm1ZHKh01e28F9g1Q0v1rUbOl9N1UmR7geGDieOGaI9CXBxUBbS7HtTMZxLctOdBRdJ0Lz43+mnRsWbfdJ1kAtqBja4LJmvOPnB/PIceSsVzv4WvS1wiYACoVVgqmRl+FnBnRPqiRekX4ZSBlMAu4B/bR1zS4ElgIcrkp/6QZ6PQWWq+q9PVmlkvnLTZutQEOxEWCmw6Mk25LnQ/XaZzwKFpOsmDdgwbFVANL6+B4x8mjt6rWwTWFq0wRgS2NJ63V5icNy49U7RZhRXAbKC2GHElZAA4gdI578/w2mKFChUqVKgA/wEdrlibNfI8twAAAABJRU5ErkJggg==",
                title: "Save",
                onPress: () => {
                    alert("dasda");
                },
            };

            PSPDFKit = await import("pspdfkit");
            const items = PSPDFKit.defaultToolbarItems;
            // Add the download button to the toolbar.
            items.push(downloadButton);
            instance = await PSPDFKit.load({
                // Container where PSPDFKit should be mounted.
                container,
                // The document to open.
                document: props.document,
                toolbarItems: items,
                // toolbarItems: [
                // 	...PSPDFKit.defaultToolbarItems,
                // 	{ type: "content-editor" }
                // ],
                // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
                baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
            });

			instance.addEventListener("annotations.change", () => {
				//console.log('annotations change')
			});

            instance.addEventListener(
                "textSelection.change",
                (textSelection) => { 
					//getannotations(instance,PSPDFKit);
                    if (textSelection) {
						// Retrieve annotations from page 0.
			
						//console.log({textSelection})
						//textSelection.getSelectedTextLines().then(lines => console.log(lines));
						textSelection.getSelectedTextLines().then((lines) => {
                           // console.log(lines);
							//setState(lines);
                        });
						// textSelection.getSelectedRectsPerPage().then(lines => console.log(lines));
                        // textSelection.getText().then((text) => {
                        //     console.log(text);
                        // });
                    } else {
                        console.log("no text is selected");
                    }
                }
            );


            const textLines = await instance.textLinesForPageIndex(0);
            
			
			instanceRef.current = instance;
			PSPDFKitRef.current = PSPDFKit;

        })();
        return () => PSPDFKit && PSPDFKit.unload(container);

    }, []);

	const getannotations = async (instance, PSPDFKit) => {
		// const annotations = await instance.getAnnotations(0);
		// console.log()
	}



	//console.log({state})

	useEffect( async () =>{
		if(state){
			const annotations = await instanceRef.current.getAnnotations(0);
			const markupAnnotations = annotations.filter(
			annotation => annotation instanceof PSPDFKitRef.current.Annotations.MarkupAnnotation
			);
			const text = await Promise.all(
			markupAnnotations.map(instanceRef.current.getMarkupAnnotationText)
			);
			console.log(text);
			return
			var rects = PSPDFKitRef.current.Immutable.List([
			   new PSPDFKitRef.current.Geometry.Rect({ left: 60, top: 93, width: 200, height: 15 }),
		    ]);
			//let rects = state; 
			var annotation = new PSPDFKitRef.current.Annotations.HighlightAnnotation({
				pageIndex: 0,
				rects: rects,
				boundingBox: PSPDFKitRef.current.Geometry.Rect.union(rects)
			});
			// console.log(PSPDFKitRef.current.Geometry.Rect.union(rects))
			// console.log(PSPDFKitRef.current.Geometry.Rect.union(state))
			// console.log({annotation})
			// console.log({rects})
			
			//instanceRef.current.create(annotation);
		}

		
		//PSPDFKitRef
		// var rects = PSPDFKitRef.current.Immutable.List([
		// 	new PSPDFKitRef.Geometry.Rect({ left: 60, top: 93, width: 200, height: 15 }),
		// ]);
		// console.log({rects})
		// var annotation = new PSPDFKitRef.Annotations.HighlightAnnotation({
		// 	pageIndex: 0,
		// 	rects: rects,
		// 	boundingBox: PSPDFKitRef.Geometry.Rect.union(rects)
		// });
		// console.log({rects})
		// console.log({annotation})
		//instanceRef.create(annotation);
	},[state])


    return (
        <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />
    );
}

/*

https://pspdfkit.com/guides/web/save-a-document/to-remote-server/
https://pspdfkit.com/guides/web/save-a-document/to-local-storage/
https://pspdfkit.com/api/web/PSPDFKit.ViewState.html#interactionMode


https://pspdfkit.com/api/web/PSPDFKit.Instance.html#getMarkupAnnotationText
Add a new annotation toolbar item
Add a text node to the first page.
Update a text node.
"annotations.delete


//422.7677936553955,283.8851776123047,33.8369140625,14.6279296875

const textLines = await instance.textLinesForPageIndex(0);
var rects = PSPDFKit.Immutable.List([
    new PSPDFKit.Geometry.Rect({ left: 60, top: 93, width: 200, height: 100})
  ]);
  var annotation = new PSPDFKit.Annotations.HighlightAnnotation({
    pageIndex: 0,
    rects: rects,
    boundingBox: PSPDFKit.Geometry.Rect.union(rects)
});
instance.create(annotation);

);
			
const textLines = await instance.textLinesForPageIndex(0);
var rects = PSPDFKit.Immutable.List([
    // new PSPDFKit.Geometry.Rect({ bottom: 412.8400421142578,  height: 14.6279296875,    left:235.0041217803955, right:422.5763874053955, top: 398.2121124267578, width: 187.572265625})
   // new PSPDFKit.Geometry.Rect({ top: 267.36968994140625,  height: 11.70234375,    left:46.92328643798828, width: 150.0578125}),
    new PSPDFKit.Geometry.Rect({ bottom: 187.61048583984376,height: 11.70234375,left: 46.92328643798828,right: 237.9998489379883,top: 175.90814208984375,width: 191.07656250000002})
]);
// var annotation = new PSPDFKit.Annotations.HighlightAnnotation({
// 	pageIndex: 0,
// 	rects: rects,
// 	boundingBox: PSPDFKit.Geometry.Rect.union(rects)
// });

// const annotation2 = new PSPDFKit.Annotations.RectangleAnnotation({
// 	pageIndex: 0,
// 	boundingBox: PSPDFKit.Geometry.Rect.union(rects),
// 	strokeWidth: 10,
// 	fillColor: PSPDFKit.Color

//   });
//   instance.create(annotation2);

https://pspdfkit.com/api/web/PSPDFKit.TextSelection.html#.getSelectedRectsPerPage


////////////////
setTimeout(() =>{
	let container = document.getElementById("root");
	let iframe = container.getElementsByTagName("iframe");
	const iWindow = iframe[0].contentWindow;
	const iDocument = iWindow.document;
	//const element = iDocument.getElementsByClassName("PSPDFKit-Root");
	const elements = iDocument.getElementsByTagName("div");
	for (let i = 0; i < elements.length; i++) {
		//elements[i].innerText = "";
		console.log(elements[i].innerText);
		//elements[i].style.display = "none";
		//return false; 
	}
	//element[0].innerHTML = "Paragraph changed!";
	//console.log(elements[0])
	// var elements = $('div');

	// // go through the elements and find the one with the value
	// elements.each(function(index, domElement) {
	//     var $element = $(domElement);

	//     // does the element have the text we're looking for?
	//     if ($element.text() === "Shipping Information") {
	//         $element.hide();
	//             // hide the element with jQuery
	//         return false; 
	//             // jump out of the each
	//     }
	// });
},1000)
*/
