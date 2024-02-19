import mqtt from "mqtt";

const topics = [
    "hdl_event",
    "hdl_action",
    "hdl_888",
    "hdl_action_1341",
    "hdl_photo",
    "hdl_machine",
    "hdl_advert",
    "hdl_device",
];

class Mqtt {
    getMessageCallbacks = [];
    client = null;
    baseUrl = import.meta.env.VITE_MQTT_URL;
    basicOptions = {
        username: import.meta.env.VITE_MQTT_USERNAME,
        password: import.meta.env.VITE_MQTT_PASSWORD,
        cleanSession: true,
        keepAlive: 60 * 2,
        connectionTimeout: 1000 * 30,
        reconnectPeriod: 1000 * 4,
    };
    device_no = "";

    constructor(options = { device_no: "" }) {
        this.device_no = options.device_no;
        this.initClient();
    }

    initClient() {
        const client = mqtt.connect(this.baseUrl, this.basicOptions);

        client.on("connect", () => {
            console.log(
                `成功连接到 MQTT 代理，客户端ID为：${client.options.clientId}`
            );
            this.client = client;
            this.subscribeToTopics();
        });

        client.on("close", () => {
            console.log("MQTT 代理连接已关闭");
            this.reconnect();
        });

        client.on("offline", () => {
            console.log("MQTT 代理已离线");
        });

        client.on("error", (error) => {
            console.error("MQTT 代理错误：", error);
        });

        client.on("message", (topic, message) => {
            this.handleMessage(topic, message);
        });

        this.client = client;
    }

    subscribeToTopics() {
        const topicsToSubscribe = topics.map(
            (topic) => `${topic}@${this.device_no}`
        );
        this.client.subscribe(topicsToSubscribe, (err) => {
            if (err) {
                console.error("订阅主题失败：", err);
            } else {
                console.log("成功订阅主题");
            }
        });
    }

    reconnect() {
        if (!this.client.connected) {
            console.log("重新连接到 MQTT 代理...");
            this.client.reconnect();
        }
    }

    handleMessage(topic, message) {
        try {
            const data = JSON.parse(message.toString());
            console.log("收到主题为", topic, "的消息：", data);
            if (data?.event === "reload") {
                window.location.reload();
            } else {
                this.getMessageCallbacks.forEach((callback) => callback(data));
            }
        } catch (error) {
            console.error("处理 MQTT 消息时出错：", error);
        }
    }

    addGetMessageCallback(callback) {
        this.getMessageCallbacks.push(callback);
        return this.getMessageCallbacks.length - 1;
    }

    removeGetMessageCallback(index) {
        this.getMessageCallbacks.splice(index, 1);
    }

    send(topic, message) {
        this.client.publish(topic, message, (err) => {
            if (err) {
                console.error("发布消息到主题失败：", err);
            } else {
                console.log("成功发布消息到主题", topic, "：", message);
            }
        });
    }

    end() {
        if (this.client) {
            this.client.end();
            this.client = null;
            console.log("MQTT 客户端连接已关闭");
        }
    }
}

export { Mqtt };
