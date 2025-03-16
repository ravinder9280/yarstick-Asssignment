import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("finance");
    const transactions = await db
      .collection("transactions")
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("finance");
    
    const result = await db.collection("transactions").insertOne({
      ...body,
      date: new Date(body.date),
      amount: parseFloat(body.amount),
      createdAt: new Date(),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log(error)

    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}