import { useState, useRef, useEffect } from "react";
import "./Note.css"
import { Pin, PinOff, Ellipsis, SquarePen, Trash2, ClipboardType} from "lucide-react"
import { useReactFlow } from "@xyflow/react";

function Note(props:any){
    const [titleMode,setTitleMode] = useState(false)
    function toggleTitleMode() {setTitleMode(!titleMode);}

    const [pinned,setPinned] = useState(false)
    function togglePinned() {setPinned(!pinned);}

    const data = props.data

    const resizing = useRef(false);
    const start = useRef({x:0, y:0, width:data.width, height:data.height});

    function startResize(event:React.MouseEvent){
        if (titleMode) {return}
        event.stopPropagation();
        event.preventDefault();

        resizing.current = true;

        start.current={
            // current mouse pos
            x:event.clientX,
            y:event.clientY,
            // current dimensions
            width:data.width,
            height:data.height
        };

        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResize);
    }

    const { getZoom } = useReactFlow();

    function resize(event:MouseEvent){
        if (titleMode) {return}
        if(!resizing.current){return;}

        const zoom = getZoom();

        // new width = current width + difference of current mousepos and last known mouse pos
        //divides by zoom to account for difference in pixel measurements
        let newWidth = start.current.width + ((event.clientX - start.current.x)/zoom)
        let newHeight = start.current.height + ((event.clientY - start.current.y)/zoom)

        data.updateNoteSize(props.id, {
            // new width = current width + difference of current mousepos and last known mouse pos
            //divides by zoom to account for difference in pixel measurements
            width:Math.max(newWidth,minWidth),
            height:newHeight
        })
    }

    function stopResize(){
        resizing.current=false
        window.removeEventListener("mousemove",resize)
        window.removeEventListener("mouseup",stopResize)
    }

    const titleRef = useRef<HTMLHeadingElement>(null);
    const iconsRef = useRef<HTMLDivElement>(null);
    const [minWidth,setMinWidth] = useState(data.width);
    
    // set min width of note, no title clipping / pushing icons out
    useEffect(() => {
        if (titleMode) {return}
        if(!titleRef.current || !iconsRef.current) return;

        const observer = new ResizeObserver(() => {
            if(!titleRef.current || !iconsRef.current) return;
            setMinWidth(titleRef.current.offsetWidth + iconsRef.current.offsetWidth + 40);
        });
        // any changes to title or icons, reset min width
        observer.observe(titleRef.current);
        observer.observe(iconsRef.current);

        return () => observer.disconnect();

    }, [titleMode]);

    const [menuOpen, setMenuOpen] = useState(false);
    function toggleMenuOpen(){setMenuOpen(!menuOpen)}

    useEffect(() => {
        if(menuOpen){window.addEventListener("click",toggleMenuOpen)}
        return () => window.removeEventListener("click", toggleMenuOpen)
    }, [menuOpen])

    function handleDelete(){
        if (data.title=="New note" && data.text=="Text will display here."){data.removeNode(props.id)}
        else {data.requestPopup("delete", props.id)}
        return
    }


    if (titleMode){
        return(
            <div className={`titleModeNote ${pinned ? "pinned" : ""}`} onDoubleClick={toggleTitleMode}>
                <h3> {data.title ? data.title : "New Note"} </h3>
            </div>
        );
    }
    else{
    return(
        <div className={`note nowheel ${pinned ? "pinned" : ""}`} style={{width:data.width, height:data.height, minWidth:minWidth}}>
            <div className="helpResize">
                {/* if data exists, use that, otherwise default */}
                <div className="noteHeader">
                    <h3 ref={titleRef} onDoubleClick={() => data.onExpand(props)}> {data.title} </h3>
                    <div className="icons nodrag nopan" ref={iconsRef}> 
                        <SquarePen onClick={(event) => {event.stopPropagation(); data.onExpand(props)}} className="icon nodrag nopan" />{!pinned? 
                        <Pin onClick={(event) => {event.stopPropagation(); togglePinned()}} className="icon"/> : 
                        <PinOff onClick={togglePinned} className="icon"/>} 
                        <Ellipsis className="icon" onClick={(event)=> {event.stopPropagation(); toggleMenuOpen()}}/> 
                    </div>
                </div> 
            </div>
            <div className="textContainer" onDoubleClick={() => data.onExpand(props)}>
                <div className="textDisplay">{data.text}</div>
            </div>     
            <div className="resize-handle nodrag nopan" onMouseDown={startResize}> </div>
            {menuOpen &&
                (<div className="dropdown nodrag nopan" onClick={(event) => event.stopPropagation()}>
                    <button onClick={toggleTitleMode}> <ClipboardType className="icon"/> Title mode </button>
                    <button onClick={() => handleDelete()}> <Trash2 className="icon"/> Delete note </button>
                </div>)
            }
        </div>
    )}
}

export default Note;