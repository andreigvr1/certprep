// AUTO-GENERATED design-pattern library for AWS SAA-C03 (pack v0.8.0).
// Each entry is a reusable architecture recipe: the problem shape that signals it,
// the solution, the services involved (in data/request-flow order), and the trap
// the exam most associates with it.
import type { DesignPattern } from '../types';

export const designPatterns: DesignPattern[] = [
  {
    "id": "decouple-with-queue",
    "name": "Decouple tiers with a queue",
    "category": "Resilience",
    "problem": "A frontend or producer calls a backend directly, so a slow or failed backend cascades into frontend failures or lost work, and the two tiers can't scale independently.",
    "solution": "Insert an SQS queue between producer and consumer. The consumer — ideally in an Auto Scaling group — polls the queue and scales based on queue depth, so producer and consumer fail and scale independently.",
    "serviceIds": [
      "sqs",
      "ec2-auto-scaling",
      "api-gateway"
    ],
    "watchOutFor": "A single EC2 instance polling a queue is still a single point of failure — the queue alone doesn't decouple anything until the consumer itself is elastic."
  },
  {
    "id": "fan-out-sns-sqs",
    "name": "Fan-out one event to many consumers",
    "category": "Resilience",
    "problem": "One event needs to trigger several independent downstream systems, and losing the event for even one of them isn't acceptable.",
    "solution": "Publish once to an SNS topic and subscribe multiple SQS queues to it. Each queue durably buffers its own copy of the message, so one slow or down consumer never blocks or drops delivery to the others.",
    "serviceIds": [
      "sns",
      "sqs"
    ],
    "watchOutFor": "Subscribing an HTTP endpoint directly to SNS (skipping SQS) means a down endpoint can miss messages — SNS itself doesn't retain them."
  },
  {
    "id": "async-offload",
    "name": "Offload long-running work asynchronously",
    "category": "Performance",
    "problem": "One API endpoint makes a slow downstream call, causing client timeouts and tying up connection capacity that starves fast endpoints.",
    "solution": "Accept the request immediately, hand the work to an SQS queue, and let separate worker processes (Lambda, ECS, or EC2) complete it asynchronously while the client polls or gets notified when done.",
    "serviceIds": [
      "sqs",
      "lambda",
      "ecs"
    ],
    "watchOutFor": "Increasing a load balancer's idle timeout to let the slow call finish synchronously treats the symptom, not the cause — every client just waits longer instead."
  },
  {
    "id": "dlq-poison-messages",
    "name": "Isolate poison messages with a dead-letter queue",
    "category": "Resilience",
    "problem": "A malformed or unprocessable message gets retried forever, blocking the queue or wasting consumer capacity.",
    "solution": "Configure a redrive policy (maxReceiveCount) on the source SQS queue pointing at a dead-letter queue. After N failed receives, SQS automatically moves the message there for investigation — no consumer code needed.",
    "serviceIds": [
      "sqs"
    ],
    "watchOutFor": "Writing failed messages to a second queue manually from the consumer is NOT a dead-letter queue — it doesn't remove the message from the original queue, and the exam treats it as wrong."
  },
  {
    "id": "dr-ladder",
    "name": "Match DR strategy to RTO and budget",
    "category": "Resilience",
    "problem": "A workload needs a documented recovery time (RTO) and recovery point (RPO) in a second Region, but full duplication is out of budget.",
    "solution": "Pick the cheapest of four strategies that still clears the stated RTO: backup & restore (cheapest, hours), pilot light (core services idle, tens of minutes), warm standby (scaled-down full stack, minutes), multi-site active/active (lowest RTO, highest cost).",
    "serviceIds": [
      "rds",
      "ec2",
      "route53"
    ],
    "watchOutFor": "\"Don't use the secondary Region unless necessary\" rules out warm standby and multi-site, but doesn't by itself distinguish pilot light from backup & restore — check the stated RTO too: backup & restore is hours, pilot light is tens of minutes. Pilot light means core/data services (e.g. the database) replicate continuously in the background while compute stays off until failover; backup & restore has no standing infrastructure in the secondary Region at all."
  },
  {
    "id": "multiaz-plus-replica",
    "name": "Combine Multi-AZ and read replicas for HA + scale",
    "category": "Resilience",
    "problem": "A relational database needs both automatic failover protection and the ability to serve growing read traffic.",
    "solution": "Enable Multi-AZ for synchronous, automatic failover to a standby in another AZ, and separately add asynchronous read replicas to offload read queries — they solve different problems and stack together.",
    "serviceIds": [
      "rds",
      "aurora"
    ],
    "watchOutFor": "The classic Multi-AZ (single standby instance) deployment isn't readable and doesn't help with read scaling. Multi-AZ DB Clusters (two readable standbys, faster ~35s failover) are the exception — check which Multi-AZ option a question means. Either way, a read replica is not an HA failover target by itself unless manually promoted."
  },
  {
    "id": "cache-strategy-by-staleness",
    "name": "Pick a caching strategy by staleness tolerance",
    "category": "Performance",
    "problem": "Frequent reads are hitting the database directly, and the scenario states a specific tolerance (or intolerance) for stale data.",
    "solution": "For 'never stale' requirements, use write-through: update the cache every time the app writes to the database. For read-heavy workloads where slightly stale is fine, use lazy loading (cache-aside): populate the cache only on a read miss.",
    "serviceIds": [
      "elasticache",
      "dax"
    ],
    "watchOutFor": "Lazy loading leaves the cache stale until the next miss after a database write — the wrong choice whenever the stem says data must never be stale."
  },
  {
    "id": "cdn-offload",
    "name": "Offload static/media traffic to a CDN",
    "category": "Performance",
    "problem": "A traffic spike (viral content, large media files) is overwhelming origin servers that were never sized for it.",
    "solution": "Put a CloudFront distribution in front of the origin — or move static assets to S3 first — so repeat requests are served from the edge cache instead of hitting the origin at all.",
    "serviceIds": [
      "cloudfront",
      "s3"
    ],
    "watchOutFor": "This only helps HTTP(S)-cacheable content — for UDP or highly dynamic per-user traffic, reach for Global Accelerator or an architectural redesign instead."
  },
  {
    "id": "least-priv-network",
    "name": "Least-privilege network segmentation between tiers",
    "category": "Security",
    "problem": "Security group rules between application tiers are too broad — open to a CIDR range or the whole VPC — and an audit flags it.",
    "solution": "Rewrite each tier's security group rule to reference the source tier's security group ID as the source/destination, instead of a CIDR block. Rules then automatically follow instances as the tier scales, with no manual IP tracking.",
    "serviceIds": [
      "security-groups"
    ],
    "watchOutFor": "Security group rules cannot reference an instance ID as a source — only a security group ID, a CIDR block, or a prefix list."
  },
  {
    "id": "encrypt-by-copy",
    "name": "Turn on encryption for an existing unencrypted resource",
    "category": "Security",
    "problem": "A live RDS instance or EBS volume was created without encryption, and a new requirement mandates it — with no direct 'enable encryption' toggle available.",
    "solution": "Take a snapshot of the unencrypted resource, copy that snapshot with encryption enabled (specifying a KMS key), then restore a new resource from the encrypted copy and cut over to it.",
    "serviceIds": [
      "rds",
      "ebs",
      "kms"
    ],
    "watchOutFor": "You cannot create an encrypted read replica, Multi-AZ standby, or in-place-encrypted copy of an unencrypted primary — the snapshot-copy-restore path is the only route."
  },
  {
    "id": "blue-green-weighted",
    "name": "Blue/green and canary rollout with weighted routing",
    "category": "Resilience",
    "problem": "A new version of an application needs to be tested with real traffic before fully replacing the old version, with an easy rollback path.",
    "solution": "Deploy the new version as a separate, parallel environment, then use Route 53 weighted routing (or an ALB weighted target group) to gradually shift a percentage of traffic to it, watching for errors before completing the cutover.",
    "serviceIds": [
      "route53",
      "elb"
    ],
    "watchOutFor": "Route 53 failover routing is for active/passive DR, not gradual rollout — picking failover routing for a canary release is a common mix-up."
  },
  {
    "id": "event-driven-serverless",
    "name": "Event-driven serverless backend",
    "category": "Performance",
    "problem": "A new API needs to scale from zero to unpredictable traffic without any server capacity planning.",
    "solution": "Front the API with API Gateway, invoke Lambda functions per route or event, and persist state in DynamoDB — every layer scales independently and automatically, and nothing is paid for while idle.",
    "serviceIds": [
      "api-gateway",
      "lambda",
      "dynamodb"
    ],
    "watchOutFor": "Lambda's 15-minute timeout and cold starts make this the wrong pattern for long-running batch work or ultra-low-latency (sub-10ms) requirements."
  },
  {
    "id": "data-lake-query",
    "name": "Query a data lake without provisioning a database",
    "category": "Cost",
    "problem": "SQL queries are needed against data sitting in S3, but only occasionally — running a database cluster just to query it periodically wastes money.",
    "solution": "Catalog the S3 data with a Glue crawler (populating the Glue Data Catalog), convert it to a columnar format like Parquet and partition it by common filter columns, then query directly with Athena, paying only per query.",
    "serviceIds": [
      "glue",
      "athena",
      "s3"
    ],
    "watchOutFor": "Un-partitioned or non-columnar (raw CSV) data makes Athena scan far more data than necessary, inflating both cost and query time."
  },
  {
    "id": "private-service-access",
    "name": "Reach an AWS service privately without NAT or an internet gateway",
    "category": "Security",
    "problem": "A private-subnet workload needs to call an AWS service (S3, DynamoDB, or most others) but traffic must not cross the public internet, or NAT Gateway costs are climbing.",
    "solution": "Add a Gateway VPC endpoint for S3/DynamoDB (free) or an Interface VPC endpoint / PrivateLink for any other AWS service. Traffic stays entirely on the AWS network and bypasses the NAT Gateway's per-GB charge.",
    "serviceIds": [
      "vpc-endpoints",
      "privatelink",
      "nat-gateway"
    ],
    "watchOutFor": "Detaching or replacing the NAT Gateway without first confirming an endpoint covers every AWS service the workload calls will break connectivity, not just cut cost."
  },
  {
    "id": "auto-remediation",
    "name": "Auto-remediate non-compliant or compromised resources",
    "category": "Security",
    "problem": "A resource drifts out of compliance (e.g. a security group opens to 0.0.0.0/0) or gets compromised, and a manual response is too slow.",
    "solution": "Use AWS Config rules — or an EventBridge rule matching a GuardDuty finding — to detect the condition, and trigger a Lambda function or SSM Automation document that fixes it automatically, e.g. revoking the offending rule or swapping the instance's security group for a locked-down quarantine group.",
    "serviceIds": [
      "config",
      "eventbridge",
      "lambda"
    ],
    "watchOutFor": "Config and Security Hub only detect and score — they don't remediate anything by themselves without an automation trigger wired up separately."
  }
];
