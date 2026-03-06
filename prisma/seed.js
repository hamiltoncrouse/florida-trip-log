const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Check if photos already exist to avoid duplicates on redeploy
  const count = await prisma.photo.count();
  if (count > 0) {
    console.log("Database already has photos, skipping seed.");
    return;
  }

  const photos = [
    { url: "https://lh3.googleusercontent.com/pw/AP1GczN-IQGXoGD1s2onmbLWsa-BLAKPL1_kFWwQReHoAQq18PbU03Iu_ChljG_sCB1K2hCdSqKTdE6-GmQ6xca48ueXxXwevmBxknIKpxOfpDQqhPPGbF0I", title: "Castillo Corner", desc: "A sunlit corner of the Castillo de San Marcos showing the weathered stone bastion and the dry moat.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczPGTcmv9DPj9ei6kTafGDN33y7Ql6bMEYu9iWjSVVt5ncep5nGlxpz0ZHwpa9YodLkPOrWPFn_xs_VNpd2vAbylitbW4QitYU5kC3V-PMct0yY-XPyh", title: "Fort Entrance Bridge", desc: "The wooden bridge and gate leading into the fort’s interior courtyard, framed by high coquina walls.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczNIXfID4cimyyjd1t63w-lDkRi4rFg7S_jGsoRVKWXkP2WGKRm317SE7CK6Tj1ddJ6NOXxs8KOmdc91GRJYZO0GpDWfr2DEh1NjvLjXAo10aVwBxRwG", title: "Visitors Crossing the Bridge", desc: "Tourists walk across the bridge into the fort, giving scale to the historic ramparts.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczO61Xwbi77_0YcU-iDLQgyxcxk2as5brleZ84khyRnm0mYzcwqAMXWBHq047JVhBGnEzIepbggCu0eAEsg3Oj576ecodIyv-NjiDGwxvQmTIgks6XCS", title: "Cannon Demonstration Begins", desc: "A gathered crowd watches reenactors prepare for a cannon demonstration on the fort’s waterfront terrace.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczOQM7DzPUB2uG3zkonK4Orzko217GJvmjMe0ngR8NMLNUqUUJ9zhLVTqZRxfDHFHtKJWCdqKpUmYLFuepnUTnjwP7Yg_7JMbs0Zg-49KI7RZ1uC7Nzs", title: "Cannons on the Ramparts", desc: "Three historic cannons displayed on a wooden platform with the bay and skyline beyond.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczPpa7Aa_Or5g08TCW5-eTyCgNZt_f1MkMrtwf0rjVeKT5cpcnFt2AD4OOjw2xQAkWRPncONI9Qu21KAu1O_ORfO-ikX7DnBQ9_3PBR_20SnwnYe3X6Z", title: "Cannon Emplaced by the Sea", desc: "Close view of the cannons with palm trees and the St. Augustine shoreline in the background.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczPr1MnqUgrF3tk8H4dWc_usiwjSBcVp7D5XJRzmRo9TTsls1LxenXxoTStmoFJFwUg4mSvUq_jWTfsy5OxMpXDCaTzvPudKIk7Mj0yg-03pnXXTufuk", title: "Crew Preparing the Gun", desc: "Reenactors in period dress check ropes and tools as they ready a cannon for firing.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczPDrygt8BGWBbk9JQ5OqUUFmDQq8W_FnDKYZD3AVVwahyXtUmcU3EDuCs7Upr0B8rFsygj1xVQR-5LrBpHfLVwt6Fzy4tDnnPN6h4lUSuMMKT-xy1Vh", title: "Loading the Cannon", desc: "The artillery crew works together on the gun carriage during the demonstration.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczMZvWaUJEsAs91P79wnqyZMwwu4FZFPhw6GLhg7JgKYwnS7_Rb6Z8NhppKJAmoB8kC9x6BoL3na-LcoA5HHBnBb4Gt73UsujNc4GSblkyHLsGdUyHu_", title: "Aiming and Ready", desc: "Two crew members stand beside a cannon, demonstrating historic artillery procedures and tools.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczN1NMrFKYZ9RgUToiFYJtc0iFmOihswueCW85VZjFHUORXwcqkV4t2ZQJKGYSV7QpJ638oawXSQ8L1pOMnuUJ4qD95-nkW8aMBQbg5pRAxqk8zCw56R", title: "Coquina Close-up", desc: "Macro detail of the fort’s coquina construction: compacted shells and lime.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczNE0jkh8g30E-1O1jFfYKcangEBCwNrKmOWXhjZcG1k6HIndlLR1n2FtiMJjZy3E6v_hurX-Ric3jfcVXYIl9WUJzJIEm0jWWv5MMLQ7rU08AQpfMrV", title: "Gilded Dome Interior", desc: "Looking up into the richly decorated, gilded dome inside the former Ponce de León Hotel.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczPa9-qLeRM0B5_5qVdtAruqG8LylDq560zVT81rWBJDeAV4e1l6IXxiIiMIYROrnMXgUtZQHqFCSApz56f4f1bp8FYDRhWKLbyFxc7FYJ8U1bC73P-g", title: "Grand Stair Hall", desc: "Warm wood balustrades and arched galleries define the dramatic main hall.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczMhMtIVke6gX4ptNS8doBFARjpwz2Zt3FIMfnvPNEszz-ShxTvUzTyRCihBZu9_HFLQReS1qCVbTuQ-vGiulc7lrG7OBBFi1rnNySzd5yXyJecOEfD0", title: "At the Grand Hall", desc: "A self-portrait inside the ornate main hall of Flagler College.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczMYlFm-CC1crEz-0LK174-PoF-1tkwzlqpGvPnqQWtUx7bEoSGr9_tMH3cLSlYESHGVIvVJq0CAmLFPF8UAPxVNF5U6nmWCR_IOObxnR1XnnFQKxnFx", title: "Tower and Courtyard", desc: "The iconic red-tile tower of Flagler College rising above the courtyard.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczNzTdGQYI1V6s9oWXTt6QhJeNcaufMeTIKaU5_804Gs7mGad_xLoQ130BuvmowM8HVxLsly6HIKLAF-qEY4NS-W-ztfvMXWWjfrSeNQLpiTjxzWY8JO", title: "Fountain and Palm", desc: "A decorative courtyard fountain at Flagler College.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczPZFvAx_Utzpx82TD1WX6Eb1crnlLJvBkaT4_Y2pwv0guwcg7VgcktwrnjhMALTm_fXZmp0djpzRPVGl-QgxLvW14HMH9OnGOVDQWuRrSQ0Vv2Qso_e", title: "Frog Fountain", desc: "The whimsical frog-ringed fountain in the Lightner Museum courtyard.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczMMK1pmFco-3-Yb-mkAl6tnlAHFsLu-B7TdpqKSHfhprbLCTGzhwwYmHq0tLbtWNJo1WXMzrG3VK7-vdl9vLGjeveF7hirH0AQrMIrivcYSrWHl4vl6", title: "Ornate Roll‑Top Secretary", desc: "An elaborate Gilded Age desk displayed in the museum.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczNyKMsorkXZJdBOQMNU8KnxsuPybulls4QBekyoURp0w1a1ypCJgwSPZnHi0JjaLgBUHj6znGMQSZmHQqxX4MvJwdIedVmmw_YdEvbSXfuDoWpoUcXQ", title: "Vintage Typewriter", desc: "A Blickensderfer typewriter in the Lightner collection.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczML-GZpPSLz7DNQvAK1sIddYnJS5MhRkvSz_cCIP__fsDDhxif6GpyKP29tsSgyg9K5h6X1y96messa5yfuY8AyF3ig-4tgZu9AsFH9YGQxKqATX33u", title: "Museum Atrium", desc: "The airy central hall of the Lightner Museum.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczNjjHMh_w2R-gPyjzgvTtQt1rNBZ3qn47PQgjTUSZuQr8qqxkaaKKNwNtgpgw73cbtUQdiz2Oe-cnlY_jK80aZtAyvvdN2UJ3OWALi2rn2vyHrZuSE4", title: "Grand Balcony View", desc: "Looking down from the museum balconies.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczNcgUuVlpNWL-5LM67RdYZQmioo2IxItaZSQAXKwWTGG4n0T9AHSqhh7qaulnpUD17xEekRLkDq55FRRSjJR-VjORdNCLJcwSKLRgPj4883O_gIsE3j", title: "Cathedral Tower", desc: "The white bell tower of the Cathedral Basilica.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczOxeU_GCjFC5pNXNQ4qHyHbsD1HAJZ1aQGvoT3Dj-Zr4ksOfRA8G8yxttokiRKXPuECklYEitm_unRxlbygX-gTT9wafMZPZpfxYfUv8BsRSckPMBgY", title: "Mission Architecture", desc: "The distinctive mission-style façade of the Cathedral Basilica.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczOCrYHG6Q22mkeEE7tis3NhqgYMUMv3u3r7g3p5Sh4k_wUAhSjUpl_CC2fF4kC3uTE-H_Eqvw-JHwk0qG8LwNvmaSmXWL4D0QI2-S0Sg-JmmCX-whVf", title: "Cathedral Entrance", desc: "Close-up of the entrance to the nation's oldest parish.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczOGTmWw_60WKHpxO1Z4w5T5x1KiDjFJhdTXhPgSgO2GKSE1g1oGM9sH7G4pqSGf_XZ7ocVdSavsipYBNpaJNGs6fgo9rdy5PbdD9yAXXnsggaYOCZiZ", title: "Plaza Views", desc: "A view across the Plaza de la Constitución.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczP7TeFcTIQ7JXMZAgTCU6m1c8pZIARdjkPuXom90xBFesERrZf4MPl2DVF5uswDU4Pk7oCJf9hvTyyxSwWvBzT6_iXKCznBsLS2K7EEvzY_O9GKWjoB", title: "Beach Stroll", desc: "A moment of reflection on St. Augustine Beach.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczOs2mmkhZHeHMLE6Byoo0JRjNGiGl6KLTJ6rWy-b9dJc0dfA-Sagmkw3_E_wTyiAQ6ejNnSEh282jY0ImDL7JvWQoIjkxgCs-bbcVQ2EDFO-JRoFNGk", title: "Shoreline Peace", desc: "The soft sands and gentle Atlantic waves.", loc: "St. Augustine" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczNoXc7xo804H5KO5VWCd9gPdrt5j9dFRSVpxKfEpFxi8_q3XOYs2P9uCZfUZq2zllG4Rt9JgD-BovMnm69eJ5poNvfrbOFYpbJr6eOBsPkvPMNHSpo2", title: "FLW Walkway", desc: "Geometric cantilevered walkways at Florida Southern College.", loc: "Lakeland" },
    { url: "https://lh3.googleusercontent.com/pw/AP1GczOSo5CzzuAbliZe_HFQ6wNuMpXm6B32N2KhxC8aEOg8pTzD-xN8wC5AUam87jE7cqwpkPZjgggnnZYbohw-gfTYaQ48Ge4_yNKvddwRDrNz0DHoMhuQ", title: "Child of the Sun", desc: "Modernist columns and reflecting pools on the FSC campus.", loc: "Lakeland" }
  ];

  for (const p of photos) {
    await prisma.photo.create({ data: p });
  }
  console.log("Seed complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
