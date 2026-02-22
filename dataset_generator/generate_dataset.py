import random
import uuid
import numpy as np
import pandas as pd
from faker import Faker
from datetime import datetime, timedelta

class StarShieldDataGenerator:

    def slight_device_variation(self, device):
        return device[:-4] + str(random.randint(1000, 9999))

    def __init__(self, num_users=600, num_posts=3000, num_swarms=4):
        self.fake = Faker()
        self.num_users = num_users
        self.num_posts = num_posts
        self.num_swarms = num_swarms
        
        self.users = []
        self.posts = []
        
        self.swarm_size = 11  # 1 hub + 10 bots
    
    def generate_users(self):
        organic_users = self.num_users - (self.num_swarms * self.swarm_size)
        
        # Organic users
        for _ in range(organic_users):
            value = int(np.random.pareto(a=2.5) * 100 + 50)
            follower_count = min(10000, value)
            self.users.append({
                "user_id": str(uuid.uuid4()),
                "account_created_at": self.fake.date_time_between(start_date='-2y', end_date='-1m'),
                "follower_count": follower_count,
                "device_id": str(uuid.uuid4()),
                "cluster_label": 0
            })

        # Swarm users
        for swarm_id in range(1, self.num_swarms + 1):
            base_device = str(uuid.uuid4())
            base_creation = self.fake.date_time_between(start_date='-4m', end_date='-2m')
            for i in range(self.swarm_size):    
                
                is_hub = (i == 0)

                follower_count = (
                    random.randint(300, 800) if is_hub
                    else random.randint(20, 120)
                )
                account_created_at = base_creation + timedelta(days=random.randint(-5, 5))
                account_age_days = (datetime.now() - account_created_at).days
                
                self.users.append({
                    "user_id": str(uuid.uuid4()),
                    "account_created_at": account_created_at,
                    "account_age_days":account_age_days,
                    "follower_count": follower_count,
                    "device_id": base_device if is_hub else self.slight_device_variation(base_device),
                    "cluster_label": swarm_id,
                    "role": "hub" if is_hub else "bot"
                })
    
    def generate_organic_posts(self):
        organic_users = [u for u in self.users if u["cluster_label"] == 0]
        
        base_time = datetime.now() - timedelta(days=random.randint(0, 30))
        hour = int(np.random.normal(loc=19, scale=3))  # evening peak
        hour = max(0, min(23, hour))

        timestamp = base_time.replace(
            hour=hour,
            minute=random.randint(0, 59),
            second=random.randint(0, 59)
        )
        for user in organic_users:
            post_count = random.randint(3, 8)

            for _ in range(post_count):

                base_time = datetime.now() - timedelta(days=random.randint(0, 30))

                hour = int(np.random.normal(loc=19, scale=3))
                hour = max(0, min(23, hour))

                timestamp = base_time.replace(
                    hour=hour,
                    minute=random.randint(0, 59),
                    second=random.randint(0, 59)
                )

                content = self.fake.sentence(nb_words=random.randint(6, 14))
                content_length = len(content.split())
                self.posts.append({
                    "post_id": str(uuid.uuid4()),
                    "user_id": user["user_id"],
                    "timestamp": timestamp,
                    "content": content,
                    "content_length":content_length
                })
    
    def inject_micro_swarms(self):

        base_messages = [
            "Energy crisis worsening rapidly in region.",
            "Financial markets facing unusual coordinated pressure.",
            "Major policy change affecting regional industries.",
            "Supply chain disruption escalating quickly."
        ]

        swarm_users = [u for u in self.users if u["cluster_label"] != 0]

        for swarm_id in range(1, self.num_swarms + 1):

            cluster_members = [u for u in swarm_users if u["cluster_label"] == swarm_id]
            hub = [u for u in cluster_members if u["role"] == "hub"][0]
            bots = [u for u in cluster_members if u["role"] == "bot"]

            base_time = datetime.now() - timedelta(days=random.randint(1, 10))
            base_message = random.choice(base_messages)

            # Hub post
            self.posts.append({
                "post_id": str(uuid.uuid4()),
                "user_id": hub["user_id"],
                "timestamp": base_time,
                "content": base_message
            })

            # Bot posts (staggered + paraphrased)
            for i, bot in enumerate(bots):
                variation = self.paraphrase_text(base_message)
                self.posts.append({
                    "post_id": str(uuid.uuid4()),
                    "user_id": bot["user_id"],
                    "timestamp": base_time + timedelta(minutes=random.randint(2, 10),seconds=random.randint(0, 30)),
                    "content": variation
                })
    def paraphrase_text(self, text):
        synonym_map = {
            "crisis": ["emergency", "situation", "instability"],
            "worsening": ["escalating", "intensifying", "deteriorating"],
            "rapidly": ["quickly", "swiftly", "fast"],
            "regional": ["local", "area", "territorial"],
            "major": ["significant", "serious", "large-scale"],
            "disruption": ["breakdown", "disturbance", "interruption"]
        }

        words = text.lower().replace(".", "").split()
        new_words = []

        for word in words:
            if word in synonym_map and random.random() < 0.6:
                new_words.append(random.choice(synonym_map[word]))
            else:
                new_words.append(word)

        return " ".join(new_words).capitalize() + "."
    
    def save_to_csv(self):
        pd.DataFrame(self.users).to_csv("users.csv", index=False)
        pd.DataFrame(self.posts).to_csv("posts.csv", index=False)
    
    def inject_false_positive_clusters(self, num_clusters=2, cluster_size=5):
        topic_messages = [
            "Local festival happening this weekend.",
            "Community festival starts this Saturday.",
            "Weekend cultural festival begins soon."
        ]

        organic_users = [u for u in self.users if u["cluster_label"] == 0]

        for _ in range(num_clusters):
            selected_users = random.sample(organic_users, cluster_size)
            base_time = datetime.now() - timedelta(days=random.randint(5, 20))
            base_msg = random.choice(topic_messages)

            for user in selected_users:
                self.posts.append({
                    "post_id": str(uuid.uuid4()),
                    "user_id": user["user_id"],
                    "timestamp": base_time + timedelta(minutes=random.randint(0, 180)),  # wide timing
                    "content": self.paraphrase_text(base_msg)
                })
    
    def generate_dataset(self):
        self.generate_users()
        self.generate_organic_posts()
        self.inject_micro_swarms()
        self.inject_false_positive_clusters()
        self.save_to_csv()
    
    

if __name__ == "__main__":
    generator = StarShieldDataGenerator()
    generator.generate_dataset()
    print("Dataset generated successfully.")