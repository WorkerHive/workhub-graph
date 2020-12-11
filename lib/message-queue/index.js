import amqplib from 'amqplib'

export default async (config) => {
    let conn = await amqplib.connect(config.url)
    let channel = await conn.createChannel();

    return {
        send: (queue, data) => {
            channel.assertQueue(queue)
            channel.sendToQueue(queue, Buffer.from(data))
        },
        consume: async (queue, receiver) => {
            channel.assertQueue(queue)
            channel.consume(queue, receiver)
        }
    }
}