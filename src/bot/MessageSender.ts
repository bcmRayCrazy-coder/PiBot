import type { NCWebsocket, SendMessageSegment } from "node-napcat-ts";

class ScheduledMessage {
    groupId?: number;
    userId?: number;
    message?: SendMessageSegment[];

    execute(bot: NCWebsocket) {
        if (!this.message || this.message.length == 0) return;
        if (this.groupId)
            return bot.send_group_msg({
                group_id: this.groupId,
                message: this.message,
            });
        else if (this.userId)
            return bot.send_private_msg({
                user_id: this.userId,
                message: this.message,
            });
    }

    static createPrivateMessage(userId: number, message: SendMessageSegment[]) {
        const scheduledMessage = new ScheduledMessage();
        scheduledMessage.userId = userId;
        scheduledMessage.message = message;
        return scheduledMessage;
    }

    static createGroupMessage(groupId: number, message: SendMessageSegment[]) {
        const scheduledMessage = new ScheduledMessage();
        scheduledMessage.groupId = groupId;
        scheduledMessage.message = message;
        return scheduledMessage;
    }
}

export class MessageSender {
    messagePool: ScheduledMessage[] = [];
    pollingTime: number;
    pollingInterval: NodeJS.Timeout | null = null;
    bot: NCWebsocket;

    constructor(bot: NCWebsocket, pollingTime = 250) {
        this.bot = bot;
        this.pollingTime = pollingTime;
    }

    poll() {
        const message = this.messagePool.shift();
        if (message) message.execute(this.bot);
    }

    sendGroupMsg(groupId: number, message: SendMessageSegment[]) {
        this.messagePool.push(
            ScheduledMessage.createGroupMessage(groupId, message),
        );
    }

    sendPrivateMsg(
        userId: number,
        message: SendMessageSegment[],
        first = false,
    ) {
        const scheduledMessage = ScheduledMessage.createPrivateMessage(
            userId,
            message,
        );
        if (first) this.messagePool.unshift(scheduledMessage);
        else this.messagePool.push(scheduledMessage);
    }

    startPolling() {
        this.pollingInterval = setInterval(() => {
            this.poll();
        }, this.pollingTime);
    }

    stopPolling() {
        if (!this.pollingInterval) return;
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
    }
}
