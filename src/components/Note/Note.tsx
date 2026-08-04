import "./Note.css"

function Note(props: { data: any; }){
    const data = props.data
    return(
        <div className="note">
            {/* if data exists, use that, otherwise default */}
            <h3> {data.title ? data.title : "New Note" }</h3>
            <p> {data.content ? data.content : "Content will display here"} </p>
        </div>
    )
}

export default Note;