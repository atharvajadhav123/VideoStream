import React from "react";
import './Comments.css'
const Comments = ({username, date, commentcontent}) => {
    return (
        <>
        <div className="card-body">
  <div className="d-flex flex-start align-items-center">
    <img
      className="rounded-circle shadow-1-strong me-3"
      src="images/userimg.png"
      alt="avatar"
      width="60"
      height="60"
    />
    <div>
      <h6 className=" comment-username fw-bold mb-1">{username}</h6>
      <p className="text-muted small mb-0">
        {date}
      </p>
    </div>
  </div>
  <p className="text-comment mt-3 mb-4 pb-2">{commentcontent} </p>

  <div className=" small d-flex justify-content-start">
    <a href="#!" className="d-flex align-items-center me-3">
      <i className="far fa-thumbs-up me-2"></i>
      <p className="mb-0">Like</p>
    </a>
    <a href="#!" className="d-flex align-items-center me-3">
      <i className="far fa-comment-dots me-2"></i>
      <p className="mb-0">Comment</p>
    </a>
    <a href="#!" className="d-flex align-items-center me-3">
      <i className="fas fa-share me-2"></i>
      <p className="mb-0">Share</p>
    </a>
  </div>
</div>

            
        </>
        );
    
};

        export default Comments;