import React from 'react';
import { InlineWidget } from "react-calendly";


function ProfileSession() {
  return (
    <div className=" w-fit md:w-full h-full">
    <InlineWidget url="https://calendly.com/mdsahil31818/book-your-session" />
    </div>
  );
}
export default ProfileSession;