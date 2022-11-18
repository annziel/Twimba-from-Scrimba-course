import { v4 as uuidv4 } from 'https://jspm.dev/uuid'
import {createTweetsDataFile} from './data.js'

let tweetsData = createTweetsDataFile()
if(localStorage.tweetsData){
    tweetsData = JSON.parse(localStorage.getItem("tweetsData"))
}    

const optionsModal = document.getElementById("options-modal")

// eventListeners and functions they invokes
document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyEvent(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetEvent()
    }
    else if(e.target.classList.contains("fa-angle-down")){
        showOptionsModal(e, e.target.dataset.tweetoptions)
    }
    else if(!e.target.closest("#options-modal")){
        optionsModal.style.display = "none"
    }
    else if(e.target.closest("#options-modal")){
        deleteElement()
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyEvent(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetEvent(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@YourSuperAccount 😎`,
            profilePic: `images/YourSuperAccount.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function showOptionsModal(e, elementId){
    Object.assign(optionsModal.style, {
        left: `${(e.pageX)-140}px`,
        top: `${e.pageY}px`,
        display: "block",
    })
    optionsModal.dataset.modal = elementId
}

function deleteElement(){
    let targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === optionsModal.dataset.modal
    })[0]
    
    let tweetUuid
    if(targetTweetObj){
        const tweetIndex = tweetsData.indexOf(targetTweetObj)
        tweetsData.splice(tweetIndex, 1)
    }
    else{
        targetTweetObj = tweetsData.filter(function(tweet){
            return tweet.replies.filter(function(reply){
                return reply.uuid === optionsModal.dataset.modal
            })[0]
        })[0]
        tweetUuid = targetTweetObj.uuid
        const tweetIndex = tweetsData.indexOf(targetTweetObj)
        const targetReplyObj = tweetsData[tweetIndex].replies.filter(function(reply){
            return reply.uuid === optionsModal.dataset.modal
        })[0]
        const replyIndex = tweetsData[tweetIndex].replies.indexOf(targetReplyObj)
        tweetsData[tweetIndex].replies.splice(replyIndex, 1)
    }

    optionsModal.style.display = "none"
    render()
    if(tweetUuid){
        handleReplyEvent(tweetUuid)
    }
}

document.addEventListener('keydown', function(e){
    if (e.code === 'Enter' && !e.shiftKey && e.target.id === 'tweet-input'){
        e.preventDefault()
        handleTweetEvent()
    }
    else if (e.code === 'Enter' && !e.shiftKey && e.target.dataset.input){
        e.preventDefault()
        addReply(e.target.dataset.input)
    }
})

function addReply(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    const tweetIndex = tweetsData.indexOf(targetTweetObj)
    const inputOfReply = document.querySelector(`[data-input='${tweetId}']`)
    
    tweetsData[tweetIndex].replies.unshift({
        handle: `@YourSuperAccount 😎`,
        profilePic: `images/YourSuperAccount.png`,
        tweetText: inputOfReply.value,
        uuid: uuidv4(),
    },)

    render()
    handleReplyEvent(tweetId)
}


// generating and rendering posts
function render(){
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
    document.getElementById('feed').innerHTML = getFeedHtml()
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){         
        let repliesHtml = ''
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                let tweetOptionsClass = ''
                if (reply.handle !== `@YourSuperAccount 😎`){
                    tweetOptionsClass = 'hidden'
                }

                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <span class="tweet-header">
                                <p class="handle">${reply.handle}</p>
                                <i class="fa-solid fa-angle-down ${tweetOptionsClass}"
                                data-tweetoptions="${reply.uuid}"
                                ></i>
                            </span>
                            <p class="tweet-text">
                                ${escapeHtml(reply.tweetText).replace(/\n\r?/g, '<br />')}
                            </p>
                        </div>
                    </div>
                </div>
                `
            })
        }

        let tweetOptionsClass = ''
        if (tweet.handle !== `@YourSuperAccount 😎`){
            tweetOptionsClass = 'hidden'
        }

        let likeIconClass = ''
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <span class="tweet-header">
                        <p class="handle">${tweet.handle}</p>
                        <i class="fa-solid fa-angle-down ${tweetOptionsClass}"
                        data-tweetoptions="${tweet.uuid}"
                        ></i>
                    </span>
                    <p class="tweet-text">
                        ${escapeHtml(tweet.tweetText).replace(/\n\r?/g, '<br />')}
                    </p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                <div id="reply-area">    
                    <div class="tweet-inner">
                            <img src="images/YourSuperAccount.png" class="profile-pic">
                            <textarea placeholder="Tweet your reply" class="reply-input" data-input="${tweet.uuid}"></textarea>
                    </div>
                </div>
                ${repliesHtml}
            </div>
        </div>
        `
    })
    return feedHtml
}

function escapeHtml(unsafe){
    return (unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
    );
 }


render()