'use server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Page } from "@/models/Page";
import User from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export default async function savePageSettings({formData, user}) {
    await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

    if(user) {
        const dataKeys = [
            'displayName','location',
            'bio', 'bgType', 'bgColor', 'bgImage', 'avatar'
        ];
      
        const dataToUpdate = {};
            for (const key of dataKeys) {
                if (formData.has(key)) {
                dataToUpdate[key] = formData.get(key);
            }
        }
      
        await Page.updateOne(
            {owner:user?.email},
            dataToUpdate,
        );

        if(formData.has('avatar')) {
            const avatarLink = formData.get('avatar');
            await User.updateOne(
                {email:user?.email},
                {image:avatarLink},
            );
        }

        return true;
    }
    
    return false;
}


export async function savePageButtons(formData) {
    await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    const session = await getServerSession(authOptions);
    
    if(session) {

        const buttonValues = {};

        formData.forEach((value, key) => {
            buttonValues[key] = value;
        });

        const dataToUpdate = {buttons: buttonValues};

        await Page.updateOne(
            {owner:session?.user?.email},
            dataToUpdate,
        );

        return true;
    }
    
    return false;
}

export async function savePageLinks(links) {
    console.log(links);
    await mongoose.connect(process.env.MONGO_URI);
    const session = await getServerSession(authOptions);
    console.log(session);
    if (session) {
      await Page.updateOne(
        {owner:session?.user?.email},
        {links},
      );
      console.log("Hello"); 
      return true;
    } else {
      return false;
    }
}