import React from 'react';

function Footer() {
    return <div className='sticky bottom-0 bg-transparent'>

        <hr/>
        <div className='h-12 flex w-auto justify-center '>
            <span className='flex items-center justify-center m-3'>
                <img className="h-8 w-8 " src="github.png" alt="github"></img>
                <h5><a className="text-black ml-3"href="https://github.com/Enescyc">Github</a></h5>
            </span>
            <span className='flex items-center justify-center m-3'>
                <img className="h-8 w-8 " src="linkedin-logo.png" alt="linkedIn"></img>
                <h5><a className='text-black ml-3 ' href="https://www.linkedin.com/in/muhammed-enes-%C5%9Fahin-8a882717b/">LinkedIn</a></h5>
            </span>
            

        </div>
        <hr/>

    </div>

        ;
}

export default Footer;
