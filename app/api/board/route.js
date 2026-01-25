import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Board from "@/models/Board";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Not authorised" }, { status: 401 });
    }

    await connectMongo();

    const user = await User.findById(session.user.id);

    const board = await Board.create({
      userId: user._id,
      name: body.name,
    });

    user.boards.push(board._id);
    await user.save();

    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
