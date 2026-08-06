import "./ExpandedNote.css"
import { X, Save } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function ExpandedNote (props:any){
    const data = props.data;
    const dragging = useRef(false);
    const offset = useRef({x:0, y:0});
    const [grabbing, setGrabbing] = useState(false);
    const titleRef = useRef<HTMLInputElement>(null);

    const [title,setTitle] = useState(data.title);
    const [text, setText] = useState(data.text);

    const [originalTitle, setOriginalTitle] = useState(title);
    const [originalText, setOriginalText] = useState(text);

    function changesMade(){
        if (originalTitle == "New note" && originalText == "Text will display here.") {return false;}
        if (title !== originalTitle) {return true;}
        if (text !== originalText) {return true;}
        return false;
    }

    function startDrag(event:React.MouseEvent){
        dragging.current = (true);
        setGrabbing(true)
        offset.current= ({
            // offset makes it so that you drag the part you click, instead of top-left
            // mouse location - note location
            x:event.clientX - data.position.x,
            y:event.clientY - data.position.y
        })
        window.addEventListener("mousemove", drag)
        window.addEventListener("mouseup", stopDrag)
    }

    function drag(event:MouseEvent){
        if(!dragging.current) {return;}
        props.updatePosition(
            data.noteId,
            {
                x:event.clientX - offset.current.x,
                y:event.clientY - offset.current.y
            }
        )
    }

    function stopDrag(){
        dragging.current = (false);
        setGrabbing(false)

        window.removeEventListener("mousemove", drag)
        window.removeEventListener("mouseup", stopDrag)
    }

    const noteRef = useRef<HTMLDivElement>(null);
    // save size between closing
    useEffect(() =>{
        // if element does not yet exist, return
        if(!noteRef.current) {return}
        // observer watches elements, if resized, run its function
        const observer = new ResizeObserver(entries => {
            // rect contains dimensions after resize
            const rect = entries[0].borderBoxSize[0];

            props.updateSize(
                data.noteId,
                {
                    width:rect.inlineSize,
                    height:rect.blockSize
                }
            )
        })
        observer.observe(noteRef.current)
        return () => {observer.disconnect()}
    }, []);

    function resizeTitle(){
        if(titleRef.current){
            // force fresh measurement - shrinks properly
            titleRef.current.style.width = "0px";
            // set titleInput to correct length to exactly house all text
            titleRef.current.style.width = `${titleRef.current.scrollWidth}px`
        }
    }
    useEffect(() =>{
        resizeTitle();
    }, [title])

    function handleExit(context:string) {
        const outputTitle = (title =="")? "New note" : title;
        const outPutText = (text =="")? "Text will display here." : text;

        if (changesMade()){props.requestPopup(context, data.noteId, {title:outputTitle, text:outPutText, expandedWidth:data.width, expandedHeight:data.height})}
        else{props.onExit(data.noteId,{title:outputTitle, text:outPutText, expandedWidth:data.width, expandedHeight:data.height},context)}
    }
    
    return(
        <div className="expandedNote nowheel" style={{left:data.position.x, top:data.position.y, width:data.width, height:data.height}} ref={noteRef}>
            <div  className={`expandedNoteDragPoint ${grabbing? "grabbing" : ""}`} onMouseDown={startDrag}>
                <div className="expandedNoteHeader">
                    <input className="titleInput nodrag" value={title} onChange={(event) => setTitle(event.target.value)} onMouseDown={(event)=>event.stopPropagation()} ref={titleRef}/>
                    <div className="icons"> <Save className="icon" onClick={() => handleExit("save")} onMouseDown={(event)=>event.stopPropagation()}/> <X onClick={() => handleExit("close")} className="icon" onMouseDown={(event)=>event.stopPropagation()}/> </div>
                </div>
            </div>
            <div className="expandedNoteNoDrag">
                <textarea className="textInput nodrag" value={text} onChange={(event) => setText(event.target.value)} onMouseDown={(event)=>event.stopPropagation()}/>
            </div>
        </div>
    )
}

export default ExpandedNote