

import React from "react";
import HTMLFlipBook from "react-pageflip";
import miracleCover from '/images/miracleCover.png';

const Page = React.forwardRef(({ children }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white shadow-sm rounded w-full h-full p-1 flex flex-col justify-center items-center font-serif text-xl leading-loose text-center"
    >
      {children}
    </div>
  );
});

const PreviewBook = () => {
  return (
    <div className="py-20 px-4 flex flex-col items-center bg-[#f9f8f3] text-black">
      <HTMLFlipBook
        width={320}
        height={420}
        size="stretch"
        minWidth={300}
        maxWidth={500}
        minHeight={400}
        maxHeight={600}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        className="shadow-xl"
      >
        <Page>
          <img src={miracleCover} alt="Book Cover" className="w-full h-full object-cover m-0 p-0" />
        </Page>
        <Page>
          <h2 className="text-2xl font-bold mb-4">Contents</h2>
          <p className="text-sm leading-relaxed">
            Introduction<br />
            <em>You Are the Miracle in Someone Else’s Story</em><br />
            How alignment works, why you're already the miracle,<br />
            and what happens when you do it on purpose.<br /><br />
            <strong>Part I: Reflections</strong><br />
            1. How to Love the Scar, Not Just the Healing<br />
            2. The Tunnel is the Temple<br />
            3. Not Letting Love In<br />
            4. It Rhymes, But It’s Not the Same Song<br />
            5. The Sacred Cows in the Room<br />
            6. The Grief of Almost<br /><br />
            
          </p>
        </Page>
        <Page>
          <p className="text-sm leading-relaxed">
            <strong>Part II: Expansions</strong><br />
            1. Not Everyone Gets a Seat in Your Dressing Room<br />
            2. Parallel Lives<br />
            3. The Empty Cup is as Sweet as the Punch<br />
            4. The Season Was Enough<br />
            5. What Does the World Need From Us Now?<br />
            6. It’s Already Been Said—But Not by You<br />
            7. Abraham Hicks Ruined Complaining for Me<br />
            8. Deepak Said: “I’m Not My Emotions.” And Honestly? Same.<br />
            9. The One-Two Punch<br />
            10. Complaining and What the World Doesn’t Need to Hear from Us Now<br />
            11. Maybe It Wasn’t About You<br />
            12. The One Who Became the Miracle<br /><br />
            </p>
        </Page>
        <Page>
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <p className="text-sm leading-relaxed">
            <em>You Are the Miracle in Someone Else’s Story</em><br /><br />
            There is a version of you the world is waiting for.<br />
            Not a future you. Not a more polished you.<br />
            But a version already glowing inside you—an awareness, a spark, a frequency—quietly waiting for your permission to emerge.<br /><br />
            This book is about remembering and becoming that.<br />
            Not by effort.<br />
            Not by fixing anything.<br />
            But by aligning with who you already are beneath the noise.<br /><br />
            We’ve been taught to wait for miracles. To hope for them.<br />
          </p>
        </Page>
        <Page>
          <p className="text-sm leading-relaxed">
            But what if your greatest transformation comes not from receiving one—but from becoming one?<br /><br />
            The truth is: you probably already have.<br />
            You’ve already been the miracle in someone else’s story.<br />
            You just didn’t know it.
            That time you called someone right when they needed it.<br />
            That moment you said something small—but they remembered it forever.<br />
            That hour you listened and didn’t judge.<br />
            That night you stayed, or forgave, or reached across the silence.<br />
            That day you showed up, even when you were falling apart yourself.<br /><br />
           
          </p>
        </Page>
        <Page>
          <p className="text-sm leading-relaxed">
             That one night stand or short romance. When you think back, you might think that it was all about you.<br />
            But in reality:<br /><br />
            Maybe you were the miracle.<br />
            You were the messenger.<br />
            And you didn’t even realize it.<br /><br />
            This journey is about realizing it now—and doing it on purpose.<br />
            It draws from many traditions. You’ll hear echoes of Abraham-Hicks, guiding us to raise our vibration and return to the Vortex where clarity and joy reside.
            You’ll feel the depth of Vedanta and Deepak Chopra’s reminder that we are not our thoughts, not our emotions, but the awareness in which all of it moves.<br />
           
            
          </p>
        </Page>
        <Page>
            <p className="text-sm leading-relaxed">
            And you’ll hear my own voice—an invitation to let your scars speak, your presence serve, and your becoming bless others in ways you may never fully see.<br /><br />

                 Because sometimes the miracle doesn’t happen to you.<br />
            It happens through you.<br />
            And when you start living that way—aligned, awake, aware—everything shifts.<br /><br />
            You become the calm in someone else’s chaos.<br />
            The reminder in their despair.<br />
            The light in their darkness.<br /><br />
            Friends will feel it. Strangers will feel it.<br />
            Your family will soften.<br />
            Your presence will change rooms.<br /><br />
                But something else happens too.<br />
            Your life begins to feel miraculous.<br />
           
            
            </p>
        </Page>
        <Page>
            <p className="text-sm leading-relaxed">
                 Joy rises for no reason.<br />
            Your body responds.<br />
            Your mind clears.<br />
            Your relationships deepen.<br />
            Synchronicities multiply.<br />
            You stop chasing. You start receiving.<br />
            You remember who you are—and what’s always been possible.<br /><br />
            You don’t just change the world around you.<br />
            You begin to live in a new one.<br /><br />
            
            </p>
        </Page>
        <Page>
            <p className="text-sm leading-relaxed">
                This is how healing happens.<br />
            This is how lives are lifted.<br />
            One person, in alignment, becoming the miracle, again and again and again.<br /><br />
            You’re not just here to get by.<br />
            You’re here to become the one the world—and you—have been waiting for.<br /><br />
            <strong>LET’S BEGIN.</strong>
            </p>
        </Page>
      </HTMLFlipBook>
    </div>
  );
};

export default PreviewBook;