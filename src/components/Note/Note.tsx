import "./Note.css"

function Note(props: { data: any; }){
    const data = props.data
    let editing = true;
    return(
        <div className="note">

            {editing?
            <div className="editing">
                <input defaultValue={data.title}></input>
                <textarea defaultValue={data.content}></textarea>
                <button> Save Note </button>
            </div>
            :
            <div>
                {/* if data exists, use that, otherwise default */}
                <h3> {data.title ? data.title : "New Note" }</h3>
                <p> {data.content ? data.content : "Content will display here"} </p>
            </div>
            }
        </div>
    )
}

export default Note;