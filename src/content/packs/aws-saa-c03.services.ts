// AUTO-GENERATED service glossary for AWS SAA-C03 (pack v0.8.0).
// Each entry defines one AWS service/feature: what it is, the concrete facts that
// decide exam questions, when to reach for it, and the specific tell vs. its look-alikes.
// Generated via parallel research passes, cross-referenced against the existing
// comparisons.ts confusable cards (see distinguishFrom[].comparisonId).
import type { Service } from '../types';

export const services: Service[] = [
  {
    "id": "ec2",
    "name": "Amazon EC2",
    "category": "Compute",
    "oneLiner": "Resizable virtual servers (instances) that run in a single Availability Zone within a VPC subnet, giving full control over the OS and runtime.",
    "specifics": [
      "An instance is a zonal resource - it lives in one AZ and does not automatically span multiple AZs.",
      "Wide range of instance families (general purpose, compute/memory/storage optimized) sized by vCPU and RAM.",
      "On-Demand pricing is per-second (Linux/Windows) with no upfront commitment.",
      "Root volume can be EBS-backed (persistent) or instance-store-backed depending on AMI.",
      "Security Groups are stateful and attach at the instance/ENI level, evaluated alongside subnet NACLs.",
      "User data scripts run once on first boot unless explicitly configured to run on every boot."
    ],
    "bestFor": [
      "Workloads needing full OS-level control, custom software, or specific licensing",
      "Long-running or steady-state applications",
      "Lift-and-shift migrations of existing servers"
    ],
    "watchOutFor": [
      "A single instance has no built-in high availability - use an Auto Scaling group across multiple AZs for resilience",
      "Public IP (unless an Elastic IP) can change when an instance is stopped and started",
      "Any data on instance store volumes is lost on stop or termination"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Lambda",
        "note": "Lambda runs your code with no server or OS to manage and no capacity to size; EC2 requires you to choose, patch, and scale the underlying instance."
      },
      {
        "service": "Amazon ECS/EKS/Fargate",
        "note": "Containers run inside EC2 instances (or Fargate) rather than being the instance itself - EC2 is the raw compute layer containers can sit on top of."
      }
    ],
    "triggers": [
      {
        "when": "workload needs full OS-level control, custom software, or specific licensing",
        "pick": "Amazon EC2"
      },
      {
        "when": "lift-and-shift migration of an existing server",
        "pick": "Amazon EC2"
      },
      {
        "when": "long-running or steady-state application",
        "pick": "Amazon EC2"
      }
    ]
  },
  {
    "id": "ec2-auto-scaling",
    "name": "Amazon EC2 Auto Scaling",
    "category": "Compute",
    "oneLiner": "A service that automatically launches and terminates EC2 instances in an Auto Scaling Group to maintain a target capacity and handle changing load.",
    "specifics": [
      "An Auto Scaling Group (ASG) spans one or more subnets/AZs within a single region.",
      "Scaling policies: target tracking (e.g. keep average CPU at X%), step scaling, simple scaling, and scheduled scaling.",
      "Uses a launch template to define instance configuration (AMI, instance type, security groups, user data).",
      "Health checks (EC2 status checks or attached ELB health checks) trigger automatic replacement of unhealthy instances.",
      "Min, max, and desired capacity define the boundaries the group scales within.",
      "No direct cost itself - you pay only for the underlying EC2 instances launched."
    ],
    "bestFor": [
      "Maintaining availability by automatically replacing unhealthy instances",
      "Matching capacity to variable or unpredictable traffic",
      "Building self-healing, horizontally scalable fleets behind a load balancer"
    ],
    "watchOutFor": [
      "Scaling on the wrong metric (e.g. CPU when the real bottleneck is memory or connections) can leave the app under- or over-scaled",
      "Subnets must be configured across multiple AZs, or the ASG cannot actually provide AZ-level redundancy",
      "The default termination policy may remove instances in an order you don't expect during scale-in"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Auto Scaling",
        "note": "AWS Auto Scaling is the account-wide orchestration layer that can manage scaling policies across EC2 Auto Scaling groups plus ECS, DynamoDB, Aurora, and Spot Fleets; EC2 Auto Scaling only manages EC2 instances in one ASG."
      }
    ],
    "triggers": [
      {
        "when": "need to automatically replace unhealthy EC2 instances to maintain availability",
        "pick": "EC2 Auto Scaling"
      },
      {
        "when": "capacity must automatically match variable or unpredictable traffic",
        "pick": "EC2 Auto Scaling"
      },
      {
        "when": "need a self-healing, horizontally scalable EC2 fleet behind a load balancer",
        "pick": "EC2 Auto Scaling"
      }
    ]
  },
  {
    "id": "aws-auto-scaling",
    "name": "AWS Auto Scaling",
    "category": "Compute",
    "oneLiner": "A unified service that lets you configure and monitor scaling policies across multiple resource types - EC2 Auto Scaling groups, ECS, DynamoDB, Aurora, and Spot Fleets - from one place.",
    "specifics": [
      "Uses 'scaling plans' that apply target-tracking recommendations across several resources at once.",
      "Can enable predictive scaling for EC2, which forecasts demand from historical load and pre-launches capacity ahead of it.",
      "Scoped to a single account and region for the resources it manages.",
      "Does not create a new type of scalable resource - it configures and coordinates scaling for resources that already support it.",
      "No separate charge beyond the cost of the underlying resources it scales."
    ],
    "bestFor": [
      "Managing scaling policies for multiple resource types through a single dashboard",
      "Using predictive scaling to proactively add EC2 capacity ahead of known demand patterns",
      "Simplifying scaling configuration when an application spans EC2, ECS, and DynamoDB together"
    ],
    "watchOutFor": [
      "Commonly confused with EC2 Auto Scaling on the exam - AWS Auto Scaling is the higher-level, multi-service orchestration tool, not the EC2-specific scaling mechanism itself"
    ],
    "distinguishFrom": [
      {
        "service": "Amazon EC2 Auto Scaling",
        "note": "EC2 Auto Scaling manages instances within one ASG; AWS Auto Scaling sits above it and can coordinate scaling policies across EC2 ASGs and other services simultaneously."
      }
    ],
    "triggers": [
      {
        "when": "need to manage scaling policies across multiple resource types (EC2 ASGs, ECS, DynamoDB, Aurora, Spot Fleets) from one place",
        "pick": "AWS Auto Scaling"
      },
      {
        "when": "want predictive scaling that forecasts demand and pre-launches EC2 capacity ahead of it",
        "pick": "AWS Auto Scaling"
      }
    ]
  },
  {
    "id": "ec2-placement-groups",
    "name": "EC2 Placement Groups",
    "category": "Compute",
    "oneLiner": "A logical grouping of EC2 instances that controls how AWS physically places them on underlying hardware, for either performance or fault isolation.",
    "specifics": [
      "Cluster: packs instances close together in a single AZ for low-latency, high-throughput networking.",
      "Spread: places each instance on distinct underlying hardware, up to 7 instances per AZ per group, to isolate against hardware failure.",
      "Partition: divides instances into logical partitions (up to 7 per AZ) that each sit on separate racks, isolating failures between partitions.",
      "A Cluster placement group cannot span multiple AZs, unlike Spread and Partition groups which can span AZs within a region.",
      "Not all instance types support every placement group strategy, and placement groups cannot be merged."
    ],
    "bestFor": [
      "Tightly-coupled HPC or low-latency workloads needing maximum network throughput (Cluster)",
      "Small numbers of critical instances that must not share underlying hardware (Spread)",
      "Large distributed systems like Hadoop or Cassandra that need rack-level fault isolation (Partition)"
    ],
    "watchOutFor": [
      "Cluster placement groups increase the risk of correlated hardware failure and can hit capacity errors more often when launching",
      "Choosing Cluster for availability instead of performance is a common exam trap - it optimizes for latency, not fault tolerance"
    ],
    "triggers": [
      {
        "when": "tightly-coupled HPC workload needs maximum network throughput and lowest latency in one AZ",
        "pick": "EC2 Placement Groups - Cluster"
      },
      {
        "when": "small number of critical instances must not share underlying hardware",
        "pick": "EC2 Placement Groups - Spread"
      },
      {
        "when": "large distributed system like Hadoop or Cassandra needs rack-level fault isolation",
        "pick": "EC2 Placement Groups - Partition"
      }
    ]
  },
  {
    "id": "ec2-purchasing-options",
    "name": "EC2 Purchasing Options",
    "category": "Compute",
    "oneLiner": "The commitment models for running EC2 instances - On-Demand, Reserved Instances, Savings Plans, and Spot - each trading flexibility for a different discount level.",
    "specifics": [
      "On-Demand: pay per second/hour with no upfront commitment, highest per-hour cost.",
      "Reserved Instances: 1- or 3-year term commitment for a significant discount; Standard RIs are less flexible, Convertible RIs allow changing instance attributes.",
      "Compute Savings Plans: commit to a consistent $/hour for 1 or 3 years, flexible across instance family, size, OS, region, and even EC2/Fargate/Lambda. EC2 Instance Savings Plans give a deeper discount but lock the commitment to one instance family in one region.",
      "Spot Instances: request spare EC2 capacity at the current Spot price (no bidding since Nov 2017) for a steep discount versus On-Demand, but AWS can reclaim the instance with a 2-minute interruption warning."
    ],
    "bestFor": [
      "On-Demand for short-term, unpredictable, or spiky workloads",
      "Reserved Instances or Savings Plans for steady-state, predictable long-term usage",
      "Spot for fault-tolerant, flexible workloads like batch processing, CI/CD, or stateless web tiers"
    ],
    "watchOutFor": [
      "Spot Instances can be terminated at any time with only a short warning - never rely on them for stateful or critical workloads without checkpointing",
      "Reserved Instance discounts are a billing construct tied to attributes like instance family and region, not a movable physical reservation"
    ],
    "distinguishFrom": [
      {
        "service": "On-Demand vs Reserved/Savings Plans vs Spot",
        "comparisonId": "cmp-purchasing",
        "note": "See the dedicated purchasing-options comparison card for a full side-by-side breakdown."
      }
    ],
    "triggers": [
      {
        "when": "steady-state, predictable long-term EC2 usage over 1-3 years",
        "pick": "Reserved Instances or Savings Plans"
      },
      {
        "when": "fault-tolerant, flexible workload like batch processing, CI/CD, or a stateless web tier that can handle interruption",
        "pick": "Spot Instances"
      },
      {
        "when": "short-term, unpredictable, or spiky workload with no commitment desired",
        "pick": "On-Demand Instances"
      }
    ]
  },
  {
    "id": "ec2-instance-store",
    "name": "Amazon EC2 Instance Store",
    "category": "Compute",
    "oneLiner": "Temporary block storage physically attached to the host server an EC2 instance runs on, offering very high IOPS but no data persistence beyond the instance's life on that host.",
    "specifics": [
      "Data survives a reboot but is lost on stop, terminate, or underlying hardware failure.",
      "Only available on certain instance types and sizes - not every instance has instance store volumes.",
      "Included in the instance's hourly price - no separate storage charge.",
      "Cannot be detached and reattached to another instance, and generally cannot be resized or snapshotted like EBS.",
      "Offers very low latency and high throughput, ideal for temporary caches, buffers, or scratch data."
    ],
    "bestFor": [
      "Temporary data such as caches, buffers, or scratch space that can be regenerated",
      "Workloads that replicate or shard data across many instances, tolerating loss of any single instance's local data"
    ],
    "watchOutFor": [
      "Common exam trap: stopping (not just rebooting) an instance wipes all instance store data, unlike EBS which persists independently",
      "Not suitable as the sole storage for anything that must survive an instance replacement"
    ],
    "distinguishFrom": [
      {
        "service": "Amazon EBS",
        "note": "EBS is network-attached, persists independently of the instance, and can be detached, reattached, resized, and snapshotted - instance store cannot do any of that."
      }
    ],
    "triggers": [
      {
        "when": "need very high IOPS temporary storage for caches, buffers, or scratch data",
        "pick": "EC2 Instance Store"
      },
      {
        "when": "data is replicated or sharded across many instances and can tolerate loss of any single instance's local data",
        "pick": "EC2 Instance Store"
      }
    ]
  },
  {
    "id": "lambda",
    "name": "AWS Lambda",
    "category": "Compute",
    "oneLiner": "A serverless compute service that runs your code in response to events without you provisioning, patching, or managing any servers.",
    "specifics": [
      "Maximum execution timeout is 15 minutes per invocation.",
      "Memory is configurable from 128 MB up to 10,240 MB, and CPU allocation scales proportionally with memory.",
      "Ephemeral /tmp storage is configurable up to 10 GB per invocation.",
      "Deployment packages can be a zip (up to 50 MB compressed, 250 MB uncompressed) or a container image up to 10 GB.",
      "Pricing is pay-per-request plus pay-per-GB-second of execution duration - nothing is charged when idle.",
      "Concurrency is bounded by an account/region concurrency limit, with optional reserved or provisioned concurrency per function."
    ],
    "bestFor": [
      "Short-lived, event-driven tasks triggered by other AWS services (S3, DynamoDB Streams, EventBridge, API Gateway)",
      "API backends built with API Gateway for variable or low-to-moderate traffic",
      "Glue logic connecting services without needing a persistent server"
    ],
    "watchOutFor": [
      "Cold starts add latency, especially for VPC-attached functions or large runtimes/packages",
      "The 15-minute maximum duration rules it out for long-running processes",
      "At sustained high, steady throughput the pay-per-invocation model can cost more than EC2 or Fargate"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Fargate / Amazon EC2",
        "note": "Lambda has no server or cluster to manage and a hard 15-minute cap; Fargate and EC2 support long-running processes and give more control over runtime environment and networking, at the cost of more setup."
      }
    ],
    "triggers": [
      {
        "when": "short-lived, event-driven task triggered by S3, DynamoDB Streams, EventBridge, or API Gateway",
        "pick": "AWS Lambda"
      },
      {
        "when": "API backend for variable or low-to-moderate traffic with no server to manage",
        "pick": "AWS Lambda"
      },
      {
        "when": "glue logic connecting services without needing a persistent server",
        "pick": "AWS Lambda"
      }
    ]
  },
  {
    "id": "ecs",
    "name": "Amazon ECS",
    "category": "Compute",
    "oneLiner": "AWS's native container orchestration service for running and scaling Docker containers, using either EC2 instances or Fargate as the underlying compute.",
    "specifics": [
      "Containers run as tasks defined by a task definition specifying image, CPU/memory, ports, and IAM role.",
      "EC2 launch type: you provision and manage the cluster's EC2 instances yourself.",
      "Fargate launch type: AWS manages the compute, no instances to patch or scale.",
      "The ECS service scheduler maintains a desired task count and integrates with ALB/NLB for load balancing.",
      "Supports auto scaling of task count via Application Auto Scaling (target tracking, step scaling, scheduled).",
      "Each task can have its own IAM task role, distinct from the underlying instance's role."
    ],
    "bestFor": [
      "Containerized applications on AWS that don't need Kubernetes-specific tooling",
      "Teams wanting simpler, AWS-native container orchestration with tight integration to ALB, IAM, and CloudWatch"
    ],
    "watchOutFor": [
      "ECS is AWS-proprietary - less portable to other clouds or on-prem than Kubernetes",
      "The EC2 launch type still requires you to manage, patch, and right-size the cluster's EC2 instances"
    ],
    "distinguishFrom": [
      {
        "service": "ECS vs EKS vs Fargate",
        "comparisonId": "cmp-ecs-eks-fargate",
        "note": "See the dedicated comparison card for how orchestrator choice (ECS vs EKS) is independent from compute choice (EC2 vs Fargate)."
      }
    ],
    "triggers": [
      {
        "when": "containerized application on AWS that doesn't need Kubernetes-specific tooling",
        "pick": "Amazon ECS"
      },
      {
        "when": "want simpler, AWS-native container orchestration tightly integrated with ALB, IAM, and CloudWatch",
        "pick": "Amazon ECS"
      }
    ]
  },
  {
    "id": "eks",
    "name": "Amazon EKS",
    "category": "Compute",
    "oneLiner": "A managed Kubernetes service where AWS runs and maintains the highly-available Kubernetes control plane, so you can run standard Kubernetes workloads on AWS.",
    "specifics": [
      "AWS runs the control plane across multiple AZs for high availability; you pay a per-cluster hourly fee plus the cost of worker nodes.",
      "Worker nodes can be self-managed EC2, EKS-managed node groups, or Fargate (serverless pods).",
      "Uses standard Kubernetes APIs and kubectl, making workloads portable across clouds and on-prem clusters.",
      "Supports IAM Roles for Service Accounts (IRSA) to grant fine-grained AWS permissions to individual pods."
    ],
    "bestFor": [
      "Teams already standardized on Kubernetes who want that operational model on AWS",
      "Workloads requiring portability across multiple clouds or hybrid/on-prem environments",
      "Using the broader Kubernetes ecosystem of operators, Helm charts, and tooling"
    ],
    "watchOutFor": [
      "Steeper learning curve and more operational overhead than ECS for teams new to Kubernetes",
      "The per-cluster control plane fee is charged even when no workloads are running"
    ],
    "distinguishFrom": [
      {
        "service": "ECS vs EKS vs Fargate",
        "comparisonId": "cmp-ecs-eks-fargate",
        "note": "See the dedicated comparison card for the orchestrator (ECS vs EKS) vs compute layer (EC2 vs Fargate) distinction."
      }
    ],
    "triggers": [
      {
        "when": "team already standardized on Kubernetes wants that operational model on AWS",
        "pick": "Amazon EKS"
      },
      {
        "when": "workload requires portability across multiple clouds or hybrid/on-prem environments",
        "pick": "Amazon EKS"
      },
      {
        "when": "need the broader Kubernetes ecosystem of operators, Helm charts, and tooling",
        "pick": "Amazon EKS"
      }
    ]
  },
  {
    "id": "fargate",
    "name": "AWS Fargate",
    "category": "Compute",
    "oneLiner": "A serverless compute engine that runs ECS tasks or EKS pods directly, without you provisioning or managing any EC2 instances.",
    "specifics": [
      "You specify CPU and memory per task/pod; AWS provisions and manages the underlying infrastructure.",
      "Pricing is pay-per-vCPU and pay-per-GB-memory for the duration the task runs, rounded to the second.",
      "Fargate Spot offers discounted pricing for interruption-tolerant tasks, with the same reclaim-with-warning tradeoff as EC2 Spot.",
      "Works as a launch/compute type for both ECS and EKS.",
      "Each task/pod runs in its own isolated compute environment rather than sharing a host kernel with other tasks."
    ],
    "bestFor": [
      "Containerized workloads where you want zero server or cluster management",
      "Spiky or unpredictable container workloads where paying only for what runs matters",
      "Reducing operational overhead of patching and scaling a container host fleet"
    ],
    "watchOutFor": [
      "Less control over instance type, placement, and low-level networking tuning than the EC2 launch type",
      "Can be more expensive than a well-utilized EC2 cluster at large, steady scale",
      "Fargate Spot tasks can be interrupted with a short warning, same as EC2 Spot"
    ],
    "distinguishFrom": [
      {
        "service": "ECS vs EKS vs Fargate",
        "comparisonId": "cmp-ecs-eks-fargate",
        "note": "See the dedicated comparison card - Fargate is the serverless compute option usable under either ECS or EKS orchestration."
      }
    ],
    "triggers": [
      {
        "when": "containerized workload where you want zero server or cluster management",
        "pick": "AWS Fargate"
      },
      {
        "when": "spiky or unpredictable container workload where paying only for what runs matters",
        "pick": "AWS Fargate"
      }
    ]
  },
  {
    "id": "ecr",
    "name": "Amazon ECR",
    "category": "Compute",
    "oneLiner": "A fully managed Docker/OCI container image registry for storing, versioning, and retrieving the container images used by ECS, EKS, Fargate, and Lambda.",
    "specifics": [
      "Offers private per-account repositories plus ECR Public for publicly shared images.",
      "Access is controlled through IAM policies and repository policies.",
      "Images can be scanned for vulnerabilities (basic scanning is free; enhanced scanning integrates with Amazon Inspector).",
      "Lifecycle policies can automatically expire old or untagged image versions.",
      "Images are encrypted at rest by default using Amazon S3-managed AES-256 encryption at no extra charge; encrypting with a KMS key instead is optional and must be explicitly configured. Pricing is based on storage and data transfer."
    ],
    "bestFor": [
      "Storing and versioning container images used by ECS, EKS, Fargate, or Lambda container-image functions",
      "Private, IAM-governed image distribution within an organization or across accounts"
    ],
    "watchOutFor": [
      "Cross-region or cross-account image replication is not automatic and must be explicitly configured",
      "Vulnerability scan findings don't block a deployment unless you build that gate into your pipeline yourself"
    ],
    "distinguishFrom": [
      {
        "service": "Docker Hub",
        "note": "ECR is AWS-native, with IAM-based access control and direct integration into ECS/EKS/Lambda deployments, unlike a general third-party public registry."
      }
    ],
    "triggers": [
      {
        "when": "need to store and version container images used by ECS, EKS, Fargate, or Lambda container-image functions",
        "pick": "Amazon ECR"
      },
      {
        "when": "need private, IAM-governed image distribution within an organization or across accounts",
        "pick": "Amazon ECR"
      }
    ]
  },
  {
    "id": "batch",
    "name": "AWS Batch",
    "category": "Compute",
    "oneLiner": "A managed service that runs batch computing jobs as containers, dynamically provisioning the optimal amount and type of compute based on queued job requirements.",
    "specifics": [
      "Jobs run as Docker containers defined by job definitions, submitted to job queues, and executed on compute environments.",
      "Compute environments can be managed or unmanaged, and can use EC2, EC2 Spot, or Fargate/Fargate Spot as the underlying compute.",
      "Compute environments can scale down to zero instances when there are no queued jobs, avoiding idle cost.",
      "Supports job dependencies, priorities, and array jobs for running many similar jobs in parallel.",
      "No built-in execution time limit, unlike Lambda's 15-minute cap, making it suited to long-running jobs."
    ],
    "bestFor": [
      "Large-scale parallel or batch workloads such as genomics analysis, financial simulations, rendering, or ETL",
      "Workloads that would otherwise require building custom job-queue and cluster-management logic"
    ],
    "watchOutFor": [
      "Not designed for real-time or low-latency requests - it's built around queued, asynchronous job scheduling",
      "Requires your workload to be packaged as a container image"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Step Functions",
        "note": "Step Functions orchestrates a workflow of steps across multiple services (including invoking Batch, Lambda, or ECS) but does not itself provision compute; AWS Batch actually provisions and runs the compute for the batch jobs."
      }
    ],
    "triggers": [
      {
        "when": "large-scale parallel or batch workload like genomics analysis, financial simulations, rendering, or ETL",
        "pick": "AWS Batch"
      },
      {
        "when": "long-running containerized job exceeds Lambda's 15-minute limit and needs queued, dynamically-provisioned compute",
        "pick": "AWS Batch"
      }
    ]
  },
  {
    "id": "app-runner",
    "name": "AWS App Runner",
    "category": "Compute",
    "oneLiner": "A fully managed service that builds, deploys, and auto-scales containerized web apps and APIs directly from source code or a container image, with minimal configuration.",
    "specifics": [
      "Can deploy from a connected source code repository (with automatic build and deploy on new commits) or from an existing container image in ECR.",
      "Automatically handles load balancing, TLS certificates, and scaling based on concurrent request volume.",
      "Can scale down to a minimal number of instances during low traffic and back up as demand increases.",
      "Supports connecting to resources inside a VPC (e.g. an RDS database) via a VPC connector.",
      "Pricing is based on provisioned compute/memory plus additional compute consumed while actively handling requests."
    ],
    "bestFor": [
      "Quickly deploying simple web applications or APIs without managing infrastructure, load balancers, or scaling policies",
      "Teams wanting source-to-URL deployment with minimal AWS configuration"
    ],
    "watchOutFor": [
      "Offers far less configurability than ECS or EKS for networking, scaling behavior, or multi-container architectures",
      "Not intended for complex microservice topologies with many interdependent containers"
    ],
    "distinguishFrom": [
      {
        "service": "Elastic Beanstalk",
        "note": "Elastic Beanstalk provisions and exposes the underlying EC2/ELB/ASG resources for you to configure directly, while App Runner abstracts them away entirely with built-in CI/CD from source."
      },
      {
        "service": "AWS Fargate / Amazon ECS",
        "note": "Fargate and ECS give more control over networking, scaling rules, and multi-container task design; App Runner trades that control for the simplest possible deploy-from-source or deploy-from-image experience."
      }
    ],
    "triggers": [
      {
        "when": "need to quickly deploy a simple web app or API without managing infrastructure, load balancers, or scaling policies",
        "pick": "AWS App Runner"
      },
      {
        "when": "want source-to-URL deployment with automatic build/deploy on new commits and minimal AWS configuration",
        "pick": "AWS App Runner"
      }
    ]
  },
  {
    "id": "s3",
    "name": "Amazon S3",
    "category": "Storage",
    "oneLiner": "A regional, virtually unlimitedly scalable object storage service for storing and retrieving any amount of data via a flat key-based namespace.",
    "specifics": [
      "Objects range from 0 bytes to 5TB; data lives in buckets that are regional resources with globally unique names.",
      "Versioning preserves every version of an object once enabled, protecting against accidental overwrites and deletes.",
      "Lifecycle rules automatically transition or expire objects between storage classes (see storage class comparison) on a schedule.",
      "Object Lock enforces WORM (write-once-read-many) retention via governance or compliance mode, often for regulatory holds.",
      "Block Public Access is an account/bucket-level setting that overrides ACLs and policies to prevent accidental public exposure.",
      "Billed per GB-month stored plus per-request and data-transfer-out charges, not a fixed capacity price."
    ],
    "bestFor": [
      "Durable, highly available storage for static assets, backups, data lakes, or application files accessed over HTTP(S).",
      "Hosting static websites or serving as an origin for CloudFront distributions.",
      "Any workload needing near-infinite scale without pre-provisioning capacity."
    ],
    "watchOutFor": [
      "S3 is not a file system — no POSIX semantics, no in-place byte-level edits, and no direct OS mount without a gateway.",
      "Versioning only protects objects uploaded after it's enabled — it does not apply retroactively to prior state."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon EBS",
        "note": "S3 is object storage accessed over the network via API/HTTP, not a block volume attached to one instance's filesystem."
      },
      {
        "service": "Amazon EFS",
        "note": "S3 has no POSIX file system semantics or file locking; EFS is for shared, mountable file access."
      }
    ],
    "triggers": [
      {
        "when": "need durable, highly available storage for static assets, backups, or a data lake accessed over HTTP(S)",
        "pick": "Amazon S3"
      },
      {
        "when": "need an origin for a CloudFront distribution or want to host a static website",
        "pick": "Amazon S3"
      },
      {
        "when": "workload needs virtually unlimited scale without pre-provisioning capacity",
        "pick": "Amazon S3"
      }
    ]
  },
  {
    "id": "s3-replication",
    "name": "S3 Cross-Region & Same-Region Replication",
    "category": "Storage",
    "oneLiner": "Automatic, asynchronous copying of S3 objects between buckets in the same Region (SRR) or different Regions (CRR).",
    "specifics": [
      "Requires versioning enabled on both source and destination buckets, plus an IAM role granting S3 permission to replicate.",
      "Replicates new objects written after the rule is configured; existing objects need S3 Batch Replication to backfill.",
      "Can replicate across AWS accounts, change storage class or object ownership at the destination, and filter by prefix or tag.",
      "Replication Time Control (RTC) offers a predictable replication window (minutes) with monitoring, for an added cost.",
      "One-directional by default; bi-directional replication requires explicitly configuring rules in both directions."
    ],
    "bestFor": [
      "Meeting compliance requirements for geographically separated copies of data (CRR).",
      "Reducing latency for read-heavy users in a different Region by keeping a local copy (CRR).",
      "Aggregating logs from multiple buckets, or syncing between production/dev accounts in the same Region (SRR)."
    ],
    "watchOutFor": [
      "Replication is asynchronous, not synchronous — it does not guarantee zero lag or loss for the destination copy.",
      "Delete markers are not replicated by default unless delete marker replication is explicitly enabled."
    ],
    "distinguishFrom": [
      {
        "service": "AWS DataSync",
        "note": "Replication is continuous and object-level within S3 itself; DataSync performs one-time or scheduled bulk transfers between different storage systems (on-prem, EFS, FSx, S3)."
      }
    ],
    "triggers": [
      {
        "when": "compliance requires geographically separated copies of S3 data",
        "pick": "S3 Cross-Region Replication (CRR)"
      },
      {
        "when": "read-heavy users in another region need a local, lower-latency copy of S3 objects",
        "pick": "S3 Cross-Region Replication (CRR)"
      },
      {
        "when": "need to aggregate logs from multiple buckets or sync objects between prod/dev accounts in the same region",
        "pick": "S3 Same-Region Replication (SRR)"
      },
      {
        "when": "replication rule was set up but objects that existed beforehand never copied",
        "pick": "S3 Batch Replication (to backfill pre-existing objects)"
      }
    ]
  },
  {
    "id": "ebs",
    "name": "Amazon EBS",
    "category": "Storage",
    "oneLiner": "Persistent block storage volumes that attach to a single EC2 instance within one Availability Zone, like a virtual hard drive.",
    "specifics": [
      "Volumes exist in one specific AZ and must attach to an instance in that same AZ; moving to another AZ requires a snapshot copy.",
      "Volume types split into SSD-backed (gp3, io2 — transactional/IOPS-heavy workloads) and HDD-backed (st1, sc1 — throughput-heavy workloads); see gp3 vs io2 comparison for tradeoffs.",
      "Multi-Attach lets io1/io2 volumes attach to multiple instances simultaneously, but only within the same AZ, and requires a cluster-aware filesystem.",
      "EBS Snapshots are incremental, point-in-time backups stored in S3 (not directly browsable) and can be copied across Regions or accounts.",
      "Billed per GB-month provisioned (plus IOPS/throughput for some types), regardless of how much data is actually used."
    ],
    "bestFor": [
      "Boot volumes and low-latency block storage for a single EC2 instance, such as databases or transactional workloads.",
      "Workloads needing consistent, predictable IOPS or throughput tied to one instance."
    ],
    "watchOutFor": [
      "Not automatically multi-AZ or shared across instances by default — losing the AZ can make the volume unavailable.",
      "Terminating an instance does not delete its EBS volumes unless 'delete on termination' is explicitly set."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon EFS",
        "note": "EBS is a block volume for one instance (or same-AZ Multi-Attach); EFS is a shared network file system mountable by many instances across AZs concurrently."
      },
      {
        "service": "EC2 Instance Store",
        "note": "EBS persists independently of the instance lifecycle and survives stop/start, unlike ephemeral instance store volumes tied to the physical host."
      }
    ],
    "triggers": [
      {
        "when": "need a boot volume or low-latency block storage for a single EC2 instance such as a database",
        "pick": "Amazon EBS"
      },
      {
        "when": "need consistent, predictable IOPS or throughput tied to one instance",
        "pick": "Amazon EBS (gp3/io2)"
      },
      {
        "when": "volume needs to move to a different Availability Zone",
        "pick": "copy an EBS snapshot to the new AZ (volumes are AZ-locked)"
      },
      {
        "when": "data must survive instance termination automatically",
        "pick": "Amazon EBS with 'delete on termination' left off - not the default assumption"
      }
    ]
  },
  {
    "id": "efs",
    "name": "Amazon EFS",
    "category": "Storage",
    "oneLiner": "A fully managed, elastic NFS file system that multiple EC2 instances across Availability Zones can mount and access concurrently.",
    "specifics": [
      "Regional service storing data redundantly across multiple AZs (Standard) or offering a One Zone class for lower cost.",
      "Automatically scales storage capacity up and down as files are added or removed — no pre-provisioning needed.",
      "POSIX-compliant file system supporting standard file locking, permissions, and hierarchical directories over NFSv4.",
      "Lifecycle Management and Infrequent Access storage class automatically move rarely-accessed files to cut cost.",
      "Billed per GB-month of data actually stored (plus throughput mode charges), not per provisioned capacity."
    ],
    "bestFor": [
      "Shared file storage where multiple EC2 instances need concurrent read/write access to the SAME files across Availability Zones.",
      "Container workloads (ECS/EKS/Fargate) needing persistent shared storage across tasks/pods.",
      "Lift-and-shift of on-premises NFS-based applications."
    ],
    "watchOutFor": [
      "Higher per-GB cost and latency than EBS for single-instance workloads — don't default to it when only one instance needs the data.",
      "Only supports Linux/NFS clients; Windows workloads needing SMB should use FSx for Windows File Server."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon EBS",
        "note": "EFS is shared across many instances/AZs simultaneously; EBS attaches to one instance (or same-AZ Multi-Attach) at a time."
      },
      {
        "service": "Amazon S3",
        "note": "EFS provides POSIX file system semantics and mountability with file locking; S3 is object storage accessed via API with no directory structure."
      }
    ],
    "triggers": [
      {
        "when": "many EC2 instances across multiple AZs need concurrent read/write access to the same files",
        "pick": "Amazon EFS"
      },
      {
        "when": "ECS/EKS/Fargate tasks or pods need persistent shared storage",
        "pick": "Amazon EFS"
      },
      {
        "when": "lift-and-shift of an on-premises NFS-based application",
        "pick": "Amazon EFS"
      },
      {
        "when": "only one EC2 instance needs the data",
        "pick": "Amazon EBS, not EFS (EFS adds cost and latency for single-instance use)"
      }
    ]
  },
  {
    "id": "fsx-lustre",
    "name": "Amazon FSx for Lustre",
    "category": "Storage",
    "oneLiner": "A fully managed, high-performance parallel file system built on Lustre, optimized for HPC, machine learning, and media workloads.",
    "specifics": [
      "Delivers sub-millisecond latencies and very high throughput plus IOPS for compute-intensive, data-heavy workloads.",
      "Scratch deployment type has no built-in redundancy (for temporary, short-term high-speed processing); Persistent type replicates within an AZ for durability.",
      "Natively integrates with S3 — can lazily load objects on first access and write results back to a linked S3 bucket.",
      "Billed per GB-month of provisioned storage capacity, with throughput tiers priced separately."
    ],
    "bestFor": [
      "High-performance computing, genomics, financial modeling, and machine learning training workloads needing fast parallel I/O.",
      "Processing large S3-based datasets directly without first copying them into a separate storage system."
    ],
    "watchOutFor": [
      "Scratch file systems are not redundant — a failed component can cause permanent loss of unreplicated data."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon EFS",
        "note": "FSx for Lustre targets ultra-high-throughput compute/HPC workloads with S3 integration; EFS targets general-purpose shared file storage over NFS with simpler management."
      }
    ],
    "triggers": [
      {
        "when": "HPC, genomics, financial modeling, or ML training workload needs fast parallel file I/O",
        "pick": "Amazon FSx for Lustre"
      },
      {
        "when": "need to run high-performance compute directly against a large S3 dataset without copying it into another system first",
        "pick": "Amazon FSx for Lustre"
      },
      {
        "when": "short-term, high-speed scratch processing where the data doesn't need to survive a failure",
        "pick": "FSx for Lustre Scratch deployment type"
      }
    ]
  },
  {
    "id": "fsx-windows",
    "name": "Amazon FSx for Windows File Server",
    "category": "Storage",
    "oneLiner": "A fully managed, native Windows file system accessible over SMB, providing shared storage for Windows-based applications.",
    "specifics": [
      "Supports the SMB protocol plus Windows-native features: Active Directory integration, DFS namespaces, NTFS permissions, and shadow copies.",
      "Single-AZ or Multi-AZ deployment options; Multi-AZ automatically fails over to a standby file server in another AZ.",
      "Supports SSD and HDD storage, with automatic daily backups (and manual snapshots) retained on a configurable schedule.",
      "Billed per GB-month of provisioned storage plus throughput capacity."
    ],
    "bestFor": [
      "Lift-and-shift of Windows-based applications needing SMB file shares, such as home directories or SQL Server workloads.",
      "Environments requiring Active Directory-integrated file permissions and Windows-native admin tooling."
    ],
    "watchOutFor": [
      "Requires AWS Managed Microsoft AD or a self-managed AD to use directory-integrated features — not standalone by default."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon EFS",
        "note": "FSx for Windows serves SMB clients with native Windows semantics; EFS serves Linux/NFS clients and lacks Windows-specific features like AD integration."
      }
    ],
    "triggers": [
      {
        "when": "lift-and-shift Windows application needs SMB file shares or home directories",
        "pick": "Amazon FSx for Windows File Server"
      },
      {
        "when": "file storage must integrate with Active Directory for NTFS permissions",
        "pick": "Amazon FSx for Windows File Server"
      },
      {
        "when": "need automatic failover to a standby file server in another AZ for a Windows share",
        "pick": "Amazon FSx for Windows File Server (Multi-AZ)"
      }
    ]
  },
  {
    "id": "storage-gateway",
    "name": "AWS Storage Gateway",
    "category": "Storage",
    "oneLiner": "A hybrid storage service connecting on-premises applications to AWS cloud storage via standard storage protocols.",
    "specifics": [
      "File Gateway presents NFS/SMB shares backed by S3 objects, with a local cache for frequently accessed data.",
      "Volume Gateway presents iSCSI block volumes, either cached (primary data in S3, hot data cached locally) or stored (primary data on-prem, async backup to S3 as EBS snapshots).",
      "Tape Gateway presents a virtual tape library (VTL), letting existing backup software archive to S3/Glacier instead of physical tapes.",
      "Runs as a virtual machine (VMware/Hyper-V/KVM) or hardware appliance on-premises, or as an EC2 instance."
    ],
    "bestFor": [
      "Extending on-premises storage capacity into the cloud without rearchitecting existing applications.",
      "Replacing physical backup tape infrastructure with cloud-backed virtual tapes.",
      "Low-latency access to frequently used data on-prem while durably storing everything in S3 in the background."
    ],
    "watchOutFor": [
      "It's a hybrid/on-prem bridge, not a way to access S3 from within AWS — mount S3 directly or use native SDKs there instead."
    ],
    "distinguishFrom": [
      {
        "service": "AWS DataSync",
        "note": "Storage Gateway provides ongoing, cached, protocol-level (NFS/SMB/iSCSI) access to cloud storage from on-premises; DataSync performs one-time or scheduled bulk transfer/migration jobs."
      }
    ],
    "triggers": [
      {
        "when": "on-premises application needs NFS/SMB or iSCSI access to cloud storage without rearchitecting",
        "pick": "AWS Storage Gateway"
      },
      {
        "when": "need to replace physical backup tape infrastructure with cloud-backed virtual tapes",
        "pick": "AWS Storage Gateway (Tape Gateway)"
      },
      {
        "when": "on-prem app needs a local cache of frequently used data while everything is durably stored in S3 in the background",
        "pick": "AWS Storage Gateway"
      }
    ]
  },
  {
    "id": "aws-backup",
    "name": "AWS Backup",
    "category": "Storage",
    "oneLiner": "A centralized, policy-based backup management service that automates and audits backups across many AWS services from one place.",
    "specifics": [
      "Not a storage service itself — it orchestrates backups for EBS, RDS, DynamoDB, EFS, FSx, Storage Gateway volumes, EC2, and more.",
      "Backup plans define schedule, lifecycle (transition to cold storage), and retention rules applied via tags or resource assignment.",
      "Backup vaults store and organize recovery points, with optional Vault Lock for immutable, WORM-compliant backups.",
      "Supports cross-Region and cross-account backup copy for disaster recovery and compliance.",
      "Billed per GB-month of backup storage consumed (warm and cold tiers priced differently), not a flat service fee."
    ],
    "bestFor": [
      "Enforcing consistent, auditable backup policies across many services and accounts from a single console.",
      "Organizations with compliance mandates needing centralized retention and provable immutability (Vault Lock)."
    ],
    "watchOutFor": [
      "Manages backup jobs and retention but does not replace application-level replication or high availability design."
    ],
    "distinguishFrom": [
      {
        "service": "Native per-service snapshots/replication",
        "note": "AWS Backup is a cross-service orchestration layer applying unified policies centrally; native snapshot/replication features are per-service and configured independently."
      }
    ],
    "triggers": [
      {
        "when": "need one centralized, auditable backup policy applied consistently across many AWS services and accounts",
        "pick": "AWS Backup"
      },
      {
        "when": "compliance requires provably immutable, WORM-compliant backups",
        "pick": "AWS Backup (Vault Lock)"
      },
      {
        "when": "need cross-Region or cross-account backup copies for disaster recovery",
        "pick": "AWS Backup"
      }
    ]
  },
  {
    "id": "snow-family",
    "name": "AWS Snow Family",
    "category": "Storage",
    "oneLiner": "Ruggedized physical devices for transferring large datasets into or out of AWS, or running compute at disconnected edge locations.",
    "specifics": [
      "Snowball Edge comes in Storage Optimized and Compute Optimized variants, offering large-scale transfer plus onboard EC2-compatible compute and optional GPU.",
      "Devices are shipped to AWS after data load; data is encrypted at rest and in transit using KMS-managed keys.",
      "Chosen when network transfer would take too long or cost too much versus physically shipping the data."
    ],
    "bestFor": [
      "Migrating petabyte-scale datasets from on-premises when internet transfer would take weeks or months.",
      "Edge locations with limited or no connectivity needing local compute and storage (Snowball Edge)."
    ],
    "watchOutFor": [
      "Snowmobile (the shipping-container-scale data truck) has been retired by AWS — do not select it despite older materials mentioning it. Snowcone was discontinued for new orders in November 2024 and support for deployed devices ended November 2025.",
      "AWS has announced it will discontinue Snowball Edge across all commercial Regions by December 31, 2026, with new-customer orders already closed as of November 2025 — treat Snow Family as a legacy answer for new designs and expect it to keep being tested for now, but not indefinitely.",
      "These devices suit bulk one-time/periodic transfers, not continuous incremental sync — use DataSync or Direct Connect for ongoing hybrid transfer."
    ],
    "distinguishFrom": [
      {
        "service": "AWS DataSync",
        "note": "Snow Family physically ships data on hardware for offline transfer; DataSync moves data online over the network and suits smaller or recurring transfers with existing connectivity."
      }
    ],
    "triggers": [
      {
        "when": "need to migrate petabyte-scale data and internet transfer would take weeks or months",
        "pick": "AWS Snow Family (Snowball Edge)"
      },
      {
        "when": "disconnected or limited-connectivity edge location needs local compute and storage",
        "pick": "AWS Snowball Edge"
      },
      {
        "when": "answer choices include Snowmobile or Snowcone",
        "pick": "treat as outdated - Snowmobile is retired and Snowcone is discontinued; Snowball Edge is the current option"
      }
    ]
  },
  {
    "id": "datasync",
    "name": "AWS DataSync",
    "category": "Storage",
    "oneLiner": "A managed online data transfer service that automates moving large amounts of data between on-premises storage and AWS, or between AWS storage services.",
    "specifics": [
      "Uses a lightweight agent (deployed as a VM) on-premises to read/write source data over NFS, SMB, or object storage protocols.",
      "Can transfer directly between AWS services too, e.g., EFS to S3 or FSx to S3, without on-premises involvement.",
      "Automatically handles encryption in transit, data integrity validation, scheduling, filtering, and incremental (delta) transfers.",
      "Billed per GB of data copied, not a flat fee — designed to be much faster than scripted copy tools over the same link."
    ],
    "bestFor": [
      "One-time migrations or ongoing scheduled/incremental syncs between on-premises file storage and AWS.",
      "Moving data between AWS storage services (e.g., populating S3 from EFS) as part of a pipeline."
    ],
    "watchOutFor": [
      "Requires network connectivity (internet, VPN, or Direct Connect) — not suited for fully disconnected/offline transfer, unlike Snow Family."
    ],
    "distinguishFrom": [
      {
        "service": "AWS Storage Gateway",
        "note": "DataSync performs discrete transfer/migration jobs; Storage Gateway provides ongoing, live protocol-level access to cloud-backed storage from on-premises applications."
      }
    ],
    "triggers": [
      {
        "when": "need ongoing scheduled or incremental sync between on-premises file storage and AWS",
        "pick": "AWS DataSync"
      },
      {
        "when": "need to move data directly between AWS storage services, e.g. EFS to S3",
        "pick": "AWS DataSync"
      },
      {
        "when": "have existing network connectivity and want much faster transfer than scripted copy tools over that link",
        "pick": "AWS DataSync"
      }
    ]
  },
  {
    "id": "transfer-family",
    "name": "AWS Transfer Family",
    "category": "Storage",
    "oneLiner": "A fully managed service providing SFTP, FTPS, FTP, and AS2 endpoints for transferring files directly into and out of S3 or EFS.",
    "specifics": [
      "Lets external partners or legacy systems use familiar file-transfer protocols without AWS needing to run or patch its own FTP/SFTP servers.",
      "Backs onto S3 buckets or EFS file systems as the actual storage, with per-user or per-session access control via IAM policies.",
      "Supports custom hostnames, managed workflows (e.g., trigger processing after upload), and integration with existing identity providers.",
      "Billed per provisioned endpoint-hour plus per-GB of data transferred, not a per-file fee."
    ],
    "bestFor": [
      "B2B or legacy partner integrations that require SFTP/FTPS file exchange but should land data in S3/EFS.",
      "Replacing self-managed FTP server infrastructure with a serverless, managed equivalent."
    ],
    "watchOutFor": [
      "It's a protocol front-end for existing S3/EFS storage, not a separate storage service — data still lives in S3 or EFS."
    ],
    "distinguishFrom": [
      {
        "service": "AWS DataSync",
        "note": "Transfer Family exposes an SFTP/FTPS/FTP/AS2 endpoint for external users/systems to push or pull individual files; DataSync is for bulk internal migration/sync jobs, not an external-facing protocol server."
      }
    ],
    "triggers": [
      {
        "when": "external partners or legacy systems need SFTP/FTPS/FTP/AS2 access but data should land in S3 or EFS",
        "pick": "AWS Transfer Family"
      },
      {
        "when": "need to replace self-managed FTP server infrastructure with a managed equivalent",
        "pick": "AWS Transfer Family"
      }
    ]
  },
  {
    "id": "rds",
    "name": "Amazon RDS",
    "category": "Database",
    "oneLiner": "Managed relational database service that handles provisioning, patching, and backups for engines like MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server.",
    "specifics": [
      "Supports MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, and Db2 as managed engine options.",
      "Automated backups support point-in-time restore within a configurable retention window of up to 35 days.",
      "Billed by instance hours (instance class), provisioned storage/IOPS, and backup storage beyond the free allotment.",
      "Storage auto scaling can grow the underlying volume automatically as data grows, without downtime.",
      "Multi-AZ gives synchronous standby failover; Read Replicas give asynchronous copies for read scaling."
    ],
    "bestFor": [
      "Traditional relational (OLTP) workloads needing SQL, joins, and transactions without managing DB server infrastructure.",
      "Lift-and-shift migration of existing on-prem relational databases to AWS."
    ],
    "watchOutFor": [
      "Vertical scaling has ceilings; very high-throughput workloads may need Aurora or a purpose-built NoSQL service instead."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon Aurora",
        "note": "Aurora is AWS's own MySQL/PostgreSQL-compatible engine with a different storage architecture that scales further and replicates faster than standard RDS engines."
      },
      {
        "service": "RDS Multi-AZ vs Read Replica",
        "comparisonId": "cmp-multiaz-readreplica",
        "note": "See the dedicated comparison card for the failover-availability vs read-scaling tradeoff."
      }
    ],
    "triggers": [
      {
        "when": "Need to migrate an on-prem relational database to AWS without managing DB server infrastructure",
        "pick": "Amazon RDS"
      },
      {
        "when": "Traditional OLTP workload needing SQL, joins, and transactions",
        "pick": "Amazon RDS"
      },
      {
        "when": "Need point-in-time restore for a relational database within a 35-day window",
        "pick": "Amazon RDS"
      }
    ]
  },
  {
    "id": "rds-proxy",
    "name": "Amazon RDS Proxy",
    "category": "Database",
    "oneLiner": "Fully managed database proxy that pools and shares database connections to improve scalability and failover speed for RDS and Aurora.",
    "specifics": [
      "Sits between the application (often Lambda) and the database, pooling and multiplexing connections instead of opening one per client.",
      "Reduces failover time by maintaining its own connections to the database and rerouting to the new primary automatically.",
      "Not a cache — it manages connection pooling and routing only; it never stores or returns query results.",
      "Supports IAM authentication for the app-to-proxy connection, separate from the database's own credentials.",
      "Billed per vCPU-hour of the database instances it's associated with, on top of the database's own cost."
    ],
    "bestFor": [
      "Lambda functions or other workloads that open many short-lived DB connections and risk exhausting max_connections.",
      "Applications that need faster, more transparent failover during Multi-AZ events."
    ],
    "watchOutFor": [
      "Does not reduce query latency or cache results — that is ElastiCache's or DAX's job, not RDS Proxy's."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon ElastiCache",
        "note": "RDS Proxy pools/reuses database connections; it does not cache data or reduce read latency the way ElastiCache does."
      }
    ],
    "triggers": [
      {
        "when": "Lambda functions opening many short-lived DB connections risk exhausting max_connections",
        "pick": "Amazon RDS Proxy"
      },
      {
        "when": "Need faster, more transparent failover during Multi-AZ database events",
        "pick": "Amazon RDS Proxy"
      },
      {
        "when": "Need to pool/reuse database connections, not cache query results",
        "pick": "Amazon RDS Proxy"
      }
    ]
  },
  {
    "id": "aurora",
    "name": "Amazon Aurora",
    "category": "Database",
    "oneLiner": "AWS-built, MySQL- and PostgreSQL-compatible relational database with cloud-native storage designed for higher throughput and availability.",
    "specifics": [
      "Cluster storage auto-scales up to 128 TiB, decoupled from compute and replicated six ways across 3 Availability Zones.",
      "Up to 15 Aurora Replicas share the same underlying storage, so replica lag is typically much lower than standard RDS read replicas.",
      "Aurora Global Database replicates a primary cluster to secondary Regions with typically sub-second lag, for DR or low-latency global reads.",
      "Aurora Serverless v2 scales compute capacity up and down in fine-grained increments automatically, billed per capacity unit consumed.",
      "Billed for compute instance hours (or capacity units for Serverless v2), storage consumed, and I/O operations."
    ],
    "bestFor": [
      "MySQL/PostgreSQL-compatible workloads needing higher throughput, availability, or replica performance than standard RDS.",
      "Global applications needing cross-Region disaster recovery or low-latency reads via Aurora Global Database.",
      "Unpredictable or spiky workloads where paying for idle fixed capacity is wasteful, via Aurora Serverless v2."
    ],
    "watchOutFor": [
      "Costs more per hour than equivalent RDS instances; not automatically cheaper for small or steady workloads."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon RDS",
        "note": "Aurora is a proprietary storage engine that speaks the MySQL/PostgreSQL wire protocol, offering more scalability and availability than standard RDS engines at a higher baseline cost."
      }
    ],
    "triggers": [
      {
        "when": "MySQL/PostgreSQL workload needs higher throughput or availability than standard RDS",
        "pick": "Amazon Aurora"
      },
      {
        "when": "Global application needs cross-Region disaster recovery or low-latency reads for a relational database",
        "pick": "Amazon Aurora (Global Database)"
      },
      {
        "when": "Unpredictable or spiky relational workload where paying for idle fixed capacity is wasteful",
        "pick": "Amazon Aurora (Serverless v2)"
      }
    ]
  },
  {
    "id": "dynamodb",
    "name": "Amazon DynamoDB",
    "category": "Database",
    "oneLiner": "Fully managed, serverless NoSQL key-value and document database offering single-digit-millisecond performance at any scale.",
    "specifics": [
      "Items are addressed by a partition key (or partition key plus sort key); maximum item size is 400 KB.",
      "Two capacity modes: on-demand (pay per request) and provisioned (pay for configured read/write capacity, optionally with auto scaling).",
      "Global Tables replicate a table across multiple Regions for active-active multi-Region reads and writes.",
      "Point-in-time recovery (PITR) enables continuous backups and restore to any second within the trailing 35-day window.",
      "DynamoDB Streams captures item-level change events, commonly used to trigger Lambda functions."
    ],
    "bestFor": [
      "High-scale applications needing predictable low-latency access by key, with flexible, schemaless items.",
      "Serverless architectures wanting a database with no servers to manage and pay-per-use pricing.",
      "Multi-Region active-active applications, via Global Tables."
    ],
    "watchOutFor": [
      "Not suited for complex multi-table joins or ad hoc queries — access patterns must be designed around keys and indexes up front."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon RDS / Aurora",
        "note": "DynamoDB is a NoSQL key-value/document store that scales horizontally; relational engines offer SQL joins and transactions across normalized schemas."
      }
    ],
    "triggers": [
      {
        "when": "High-scale application needs predictable low-latency access by key with flexible, schemaless items",
        "pick": "Amazon DynamoDB"
      },
      {
        "when": "Serverless architecture wants a database with no servers to manage and pay-per-request pricing",
        "pick": "Amazon DynamoDB"
      },
      {
        "when": "Need multi-Region active-active reads and writes for a database",
        "pick": "Amazon DynamoDB (Global Tables)"
      }
    ]
  },
  {
    "id": "dax",
    "name": "DynamoDB Accelerator (DAX)",
    "category": "Database",
    "oneLiner": "In-memory caching layer built specifically for DynamoDB that speeds up read-heavy workloads down to microsecond latency.",
    "specifics": [
      "Write-through cache: writes sent via the DAX client go through DAX to DynamoDB and DAX updates its cached copy, but this adds no speed benefit for writes — a write still must complete against DynamoDB before DAX acknowledges it, so only reads actually get faster.",
      "Deployed as a cluster inside a VPC and is API-compatible with DynamoDB, requiring minimal application changes via the DAX client.",
      "Caches both individual item lookups (GetItem/BatchGetItem) and query/scan results, with a configurable TTL.",
      "Billed per node-hour based on node type and count, separately from the underlying DynamoDB table's own billing."
    ],
    "bestFor": [
      "Read-heavy or read-bursty DynamoDB workloads needing microsecond response times beyond DynamoDB's native latency.",
      "Applications with hot keys, to reduce repeated read load hitting the DynamoDB table directly."
    ],
    "watchOutFor": [
      "Does not help write-heavy workloads or reduce write latency/cost.",
      "Adds an operational component (a cluster to size and manage) versus DynamoDB's fully serverless model."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon ElastiCache",
        "note": "DAX is purpose-built and API-transparent for DynamoDB caching only; ElastiCache is general-purpose and needs application-level cache logic in front of any data source."
      }
    ],
    "triggers": [
      {
        "when": "Read-heavy or read-bursty DynamoDB workload needs microsecond response times",
        "pick": "DynamoDB Accelerator (DAX)"
      },
      {
        "when": "Hot keys causing repeated read load directly against a DynamoDB table",
        "pick": "DynamoDB Accelerator (DAX)"
      }
    ]
  },
  {
    "id": "elasticache",
    "name": "Amazon ElastiCache",
    "category": "Database",
    "oneLiner": "Managed in-memory data store service for caching and low-latency data access, supporting Redis OSS and Memcached engines.",
    "specifics": [
      "Redis OSS engine supports persistence, replication, Multi-AZ failover, and rich data structures (lists, sets, sorted sets, pub/sub).",
      "Memcached engine is simpler and multi-threaded, offering a pure distributed in-memory cache with no persistence or replication.",
      "Billed per node-hour based on node type and the number of nodes/shards in the cluster.",
      "Common caching strategies are lazy loading (cache-aside) and write-through, each with different staleness/consistency tradeoffs."
    ],
    "bestFor": [
      "Offloading read pressure from a database by caching frequently accessed query results (cache-aside pattern).",
      "Session storage, leaderboards, or pub/sub messaging where Redis's data structures add value.",
      "Simple, high-throughput, horizontally scaled caching with no persistence requirement (Memcached)."
    ],
    "watchOutFor": [
      "Cache invalidation and staleness must be handled by the application; ElastiCache does not auto-sync with the source database."
    ],
    "distinguishFrom": [
      {
        "service": "DynamoDB Accelerator (DAX)",
        "note": "ElastiCache is general-purpose and can front any data source; DAX is purpose-built and API-transparent specifically for DynamoDB."
      }
    ],
    "triggers": [
      {
        "when": "Offload read pressure from a database by caching frequently accessed query results",
        "pick": "Amazon ElastiCache"
      },
      {
        "when": "Need session storage, leaderboards, or pub/sub messaging with rich data structures",
        "pick": "Amazon ElastiCache (Redis OSS)"
      },
      {
        "when": "Need simple, high-throughput distributed caching with no persistence requirement",
        "pick": "Amazon ElastiCache (Memcached)"
      }
    ]
  },
  {
    "id": "redshift",
    "name": "Amazon Redshift",
    "category": "Database",
    "oneLiner": "Fully managed, petabyte-scale data warehouse service for fast SQL analytics (OLAP) over large structured datasets.",
    "specifics": [
      "Uses columnar storage and massively parallel processing (MPP) across a cluster of compute nodes for fast aggregate queries.",
      "Redshift Spectrum lets queries run directly against data sitting in S3 without loading it into the cluster first.",
      "Provisioned clusters bill per node-hour; Redshift Serverless bills based on capacity (RPUs) consumed for actual query processing.",
      "Supports standard SQL and integrates with BI tools via JDBC/ODBC."
    ],
    "bestFor": [
      "Business intelligence and analytics over large volumes of structured or semi-structured data (data warehousing).",
      "Complex aggregate reporting queries across historical data joined from multiple sources."
    ],
    "watchOutFor": [
      "Not designed for high-volume transactional (OLTP) workloads with frequent small writes — that's RDS/Aurora/DynamoDB's role."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon Athena",
        "note": "Redshift is a provisioned or serverless data warehouse optimized for repeated complex queries on loaded data; Athena is serverless ad hoc SQL directly over S3 with no cluster to manage."
      }
    ],
    "triggers": [
      {
        "when": "Need business intelligence and analytics over large volumes of structured data",
        "pick": "Amazon Redshift"
      },
      {
        "when": "Complex aggregate reporting queries across historical data joined from multiple sources",
        "pick": "Amazon Redshift"
      },
      {
        "when": "Need to run repeated complex SQL queries against data already loaded into a cluster",
        "pick": "Amazon Redshift"
      }
    ]
  },
  {
    "id": "sns",
    "name": "Amazon SNS",
    "category": "Messaging & Integration",
    "oneLiner": "Fully managed pub/sub messaging service that pushes messages from publishers to multiple subscribing endpoints or systems.",
    "specifics": [
      "Supports many subscriber types: SQS queues, Lambda, HTTP/S endpoints, email, SMS, and mobile push.",
      "Delivers each published message to all current subscribers of a topic (fan-out pattern).",
      "Billed per number of requests published and notifications delivered, plus per-protocol delivery charges (e.g. SMS).",
      "Supports Standard topics (high throughput, best-effort ordering) and FIFO topics (strict ordering, exactly-once, typically paired with SQS FIFO)."
    ],
    "bestFor": [
      "Fan-out architectures broadcasting one event to multiple independent downstream consumers simultaneously.",
      "Application alerting and notifications (email, SMS, push) triggered by system events."
    ],
    "watchOutFor": [
      "SNS does not retain/queue messages for a subscriber the way SQS does; a downed HTTP endpoint can miss messages without retries/DLQ configured."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon SQS",
        "comparisonId": "cmp-sqs-sns",
        "note": "See the dedicated comparison card: SNS pushes to many subscribers (pub/sub), while SQS holds messages for pull-based consumption."
      }
    ],
    "triggers": [
      {
        "when": "one event needs to reach many independent subscribers at once (SQS queues, Lambda, email, SMS, push)",
        "pick": "Amazon SNS (fan-out)"
      },
      {
        "when": "need to trigger email/SMS/push alerts when a system event occurs",
        "pick": "Amazon SNS"
      },
      {
        "when": "pub/sub topic where all current subscribers get every published message",
        "pick": "Amazon SNS"
      }
    ]
  },
  {
    "id": "sqs",
    "name": "Amazon SQS",
    "category": "Messaging & Integration",
    "oneLiner": "Fully managed message queuing service that decouples producers and consumers by durably storing messages until processed.",
    "specifics": [
      "Standard queues offer nearly unlimited throughput with at-least-once delivery and best-effort ordering (possible duplicates or reordering).",
      "FIFO queues guarantee exactly-once processing and strict ordering within a message group, at lower throughput limits than Standard.",
      "Maximum message retention period is 14 days, configurable per queue.",
      "Visibility timeout hides a message from other consumers while one consumer processes it; if not deleted in time it becomes visible again.",
      "Dead-letter queues are configured via a redrive policy (maxReceiveCount) on the source queue — not something a consumer writes to manually.",
      "Billed per number of API requests, where batched requests count as multiple requests."
    ],
    "bestFor": [
      "Decoupling microservices so producers and consumers scale independently and survive consumer downtime.",
      "Buffering or leveling spiky workloads before processing, e.g. in front of a worker fleet or Lambda."
    ],
    "watchOutFor": [
      "A message that repeatedly fails processing (never deleted) keeps reappearing after each visibility timeout unless a DLQ redrive policy is set."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon SNS",
        "comparisonId": "cmp-sqs-sns",
        "note": "See the dedicated comparison card: SQS is pull-based queuing for one consumer group, while SNS pushes to many subscribers."
      }
    ],
    "triggers": [
      {
        "when": "decouple producers and consumers so each scales independently and survives consumer downtime",
        "pick": "Amazon SQS"
      },
      {
        "when": "buffer or smooth a spiky workload in front of a worker fleet or Lambda",
        "pick": "Amazon SQS"
      },
      {
        "when": "a failed message keeps reappearing/being reprocessed after each timeout",
        "pick": "Amazon SQS with a dead-letter queue (redrive policy)"
      },
      {
        "when": "need exactly-once processing with strict ordering within a group",
        "pick": "Amazon SQS FIFO queue"
      }
    ]
  },
  {
    "id": "eventbridge",
    "name": "Amazon EventBridge",
    "category": "Messaging & Integration",
    "oneLiner": "Serverless event bus service that routes events between AWS services, SaaS applications, and custom applications based on rules.",
    "specifics": [
      "Rules match event patterns and route matching events to one or more targets, such as Lambda, Step Functions, SQS, or SNS.",
      "Scheduled rules (cron or rate expressions) trigger targets on a schedule, acting as a managed, serverless cron.",
      "Schema Registry can infer and store event structure for validation and code binding generation.",
      "Supports multiple event buses: a default bus for AWS service events, plus custom buses for application-specific events.",
      "Billed per number of events published/matched on custom and partner buses; many AWS-service-generated events are free."
    ],
    "bestFor": [
      "Event-driven architectures that react to state changes across decoupled AWS services or SaaS partners.",
      "Replacing simple cron-based scheduled jobs with a managed, serverless scheduler."
    ],
    "watchOutFor": [
      "Event delivery is at-least-once and asynchronous; don't rely on it for strict ordering guarantees like SQS FIFO provides."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon SNS",
        "note": "EventBridge adds content-based pattern matching, a schema registry, and many built-in AWS/SaaS event sources; SNS is simpler pub/sub fan-out without filtering on event content."
      }
    ],
    "triggers": [
      {
        "when": "route events between AWS services or SaaS partners based on matching event content/patterns",
        "pick": "Amazon EventBridge"
      },
      {
        "when": "need a managed, serverless replacement for cron-based scheduled jobs",
        "pick": "Amazon EventBridge (scheduled rules)"
      },
      {
        "when": "need a schema registry to infer/validate event structure and generate code bindings",
        "pick": "Amazon EventBridge"
      }
    ]
  },
  {
    "id": "step-functions",
    "name": "AWS Step Functions",
    "category": "Messaging & Integration",
    "oneLiner": "Serverless orchestration service that coordinates multiple AWS services into visual, stateful workflows using state machines.",
    "specifics": [
      "Workflows are defined as state machines (Amazon States Language JSON) with states for tasks, choices, parallel branches, and waits.",
      "Standard workflows support long-running executions (up to a year), exactly-once execution, and full execution history/visualization.",
      "Express workflows target high-volume, short-duration event processing with at-least-once execution.",
      "Standard workflows are billed per state transition; Express workflows are billed per execution count, duration, and memory.",
      "Built-in retry and catch behavior can be defined per state without writing custom error-handling code."
    ],
    "bestFor": [
      "Orchestrating multi-step business processes or chains of Lambda functions that need visibility, retries, and error handling.",
      "Coordinating long-running or human-in-the-loop workflows across multiple AWS services."
    ],
    "watchOutFor": [
      "Adds orchestration overhead and cost compared to a simple direct service-to-service integration for trivial single-step tasks."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon EventBridge",
        "note": "Step Functions orchestrates an explicit, ordered multi-step workflow with state and branching logic; EventBridge routes independent events to targets without maintaining workflow state."
      }
    ],
    "triggers": [
      {
        "when": "coordinate a multi-step business process or chain of Lambda functions with visibility, retries, and error handling",
        "pick": "AWS Step Functions"
      },
      {
        "when": "need a visual state machine with branching/parallel logic and built-in per-state retry/catch",
        "pick": "AWS Step Functions"
      },
      {
        "when": "long-running (up to a year) or human-in-the-loop workflow across multiple AWS services",
        "pick": "AWS Step Functions (Standard workflow)"
      }
    ]
  },
  {
    "id": "api-gateway",
    "name": "Amazon API Gateway",
    "category": "Messaging & Integration",
    "oneLiner": "Fully managed service for creating, publishing, and securing REST, HTTP, and WebSocket APIs at any scale.",
    "specifics": [
      "Supports REST APIs (full feature set), HTTP APIs (lighter-weight, lower-cost, lower-latency subset), and WebSocket APIs for two-way real-time communication.",
      "Integrates natively with Lambda via proxy integration, as well as HTTP backends and other AWS services.",
      "Provides built-in throttling/rate limiting, request/response transformation, and authorization via IAM, Cognito, or Lambda authorizers.",
      "Billed per number of API calls received plus data transfer, with optional response caching billed per cache-hour.",
      "Usage plans and API keys allow throttling and metering of individual API consumers."
    ],
    "bestFor": [
      "Exposing serverless (Lambda) or backend services as managed, scalable HTTP APIs without running your own API layer.",
      "Applications needing built-in throttling, authorization, and request validation in front of backend logic."
    ],
    "watchOutFor": [
      "REST API's response caching and advanced features add cost/complexity; HTTP APIs are cheaper but have a smaller feature set, such as no built-in caching."
    ],
    "distinguishFrom": [
      {
        "service": "Application Load Balancer",
        "note": "API Gateway is a managed API layer with throttling, auth, and request transformation built in; an ALB is a lower-level HTTP(S) load balancer without native API management features."
      }
    ],
    "triggers": [
      {
        "when": "expose a Lambda or backend service as a managed, scalable HTTP API without running your own API layer",
        "pick": "Amazon API Gateway"
      },
      {
        "when": "need built-in throttling, IAM/Cognito/Lambda authorization, and request validation in front of backend logic",
        "pick": "Amazon API Gateway"
      },
      {
        "when": "need a two-way real-time API",
        "pick": "Amazon API Gateway (WebSocket API)"
      }
    ]
  },
  {
    "id": "vpc",
    "name": "Amazon VPC",
    "category": "Networking",
    "oneLiner": "A logically isolated, private network you define within AWS where you launch resources like EC2 and RDS.",
    "specifics": [
      "Regional construct; subnets within it are each pinned to a single Availability Zone",
      "You define an IPv4 CIDR block (/16 to /28) at creation; optional IPv6 CIDR can be added",
      "Each VPC gets a default route table, default NACL (allow all), and default security group",
      "Every new AWS account gets a default VPC per region with a default subnet in each AZ, publicly routable",
      "No direct cost for the VPC itself; you pay for the resources and gateways/endpoints running inside it",
      "Subnets are 'public' only because their route table sends 0.0.0.0/0 to an Internet Gateway, not by any inherent property"
    ],
    "bestFor": [
      "Any workload needing network isolation, custom IP addressing, or multi-tier segmentation (public/private/isolated subnets)",
      "Meeting compliance requirements that mandate private, non-shared network boundaries",
      "Hosting resources that must communicate privately with on-premises networks via VPN or Direct Connect"
    ],
    "watchOutFor": [
      "The VPC CIDR block cannot be shrunk after creation, and the primary CIDR cannot be changed; plan sizing upfront (secondary CIDRs can be added)",
      "Subnet CIDRs cannot overlap with each other and reserve 5 IPs per subnet for AWS use"
    ],
    "triggers": [
      {
        "when": "workload needs network isolation, custom IP addressing, or public/private/isolated subnet segmentation",
        "pick": "Amazon VPC"
      },
      {
        "when": "compliance requires a private, non-shared network boundary",
        "pick": "Amazon VPC"
      },
      {
        "when": "question calls a subnet 'public' or 'private' and asks what actually makes it so",
        "pick": "Amazon VPC (route table to an Internet Gateway defines public, not any inherent subnet property)"
      }
    ]
  },
  {
    "id": "security-groups",
    "name": "Security Groups",
    "category": "Networking",
    "oneLiner": "A stateful virtual firewall attached to ENIs/instances that controls inbound and outbound traffic with allow-only rules.",
    "specifics": [
      "Stateful: return traffic for an allowed inbound request is automatically permitted outbound, and vice versa",
      "Operates at the instance/ENI level, not the subnet level",
      "Supports only ALLOW rules, evaluated together (no deny rules, no rule ordering/priority)",
      "A rule's source/destination can be a CIDR block OR another security group ID, enabling tier-to-tier references without hardcoding IPs",
      "An instance can have multiple security groups attached; effective rules are the union of all of them",
      "No cost to create or use security groups"
    ],
    "bestFor": [
      "Restricting which instances/services can reach a given EC2 instance, RDS database, or Lambda ENI",
      "Least-privilege tier isolation, e.g. allowing only the web-tier security group as a source on the app-tier's inbound rule",
      "Fine-grained, per-resource access control that changes as instances scale in/out (rules follow the SG, not fixed IPs)"
    ],
    "watchOutFor": [
      "Because there's no deny rule, you cannot explicitly block a single bad actor at the SG level — that requires a NACL"
    ],
    "distinguishFrom": [
      {
        "service": "Network ACLs",
        "note": "SGs are stateful and instance-level with allow-only rules; NACLs are stateless and subnet-level with allow+deny rules.",
        "comparisonId": "cmp-sg-nacl"
      }
    ],
    "triggers": [
      {
        "when": "app-tier should accept traffic only from the web-tier, referenced without hardcoding IPs",
        "pick": "Security Groups (source = another security group)"
      },
      {
        "when": "rules must automatically follow instances as they scale in/out",
        "pick": "Security Groups"
      },
      {
        "when": "return traffic for an allowed inbound request needs no separate outbound rule",
        "pick": "Security Groups (stateful)"
      }
    ]
  },
  {
    "id": "network-acls",
    "name": "Network ACLs",
    "category": "Networking",
    "oneLiner": "A stateless, subnet-level firewall that evaluates numbered allow and deny rules in order for traffic entering or leaving a subnet.",
    "specifics": [
      "Stateless: return traffic must be explicitly allowed by a separate rule, since inbound and outbound are evaluated independently",
      "Operates at the subnet level, so it applies to every resource in that subnet",
      "Supports both ALLOW and DENY rules, each with a rule number; lower numbers are evaluated first and the first match wins",
      "The default NACL allows all inbound and outbound traffic; a custom NACL denies all by default until rules are added",
      "Every subnet is associated with exactly one NACL, but one NACL can be associated with multiple subnets",
      "No cost to create or use network ACLs"
    ],
    "bestFor": [
      "Explicitly blocking a known malicious CIDR range at the subnet boundary (a deny rule SGs cannot express)",
      "A coarse, subnet-wide backstop layered on top of per-instance security groups (defense in depth)",
      "Enforcing a blanket policy across every resource in a subnet regardless of individual instance configuration"
    ],
    "watchOutFor": [
      "Because it's stateless, forgetting the matching return-traffic rule (e.g. ephemeral ports outbound) is the most common cause of unexpected connection failures"
    ],
    "distinguishFrom": [
      {
        "service": "Security Groups",
        "note": "NACLs are stateless and subnet-level with allow+deny rules; SGs are stateful and instance-level with allow-only rules.",
        "comparisonId": "cmp-sg-nacl"
      }
    ],
    "triggers": [
      {
        "when": "need to explicitly deny/block a known malicious CIDR range at the subnet boundary",
        "pick": "Network ACLs"
      },
      {
        "when": "need a subnet-wide backstop layered on top of per-instance security groups",
        "pick": "Network ACLs"
      },
      {
        "when": "connections fail unexpectedly even though the inbound rule looks correct",
        "pick": "Network ACLs (missing stateless return-traffic rule, e.g. ephemeral ports)"
      }
    ]
  },
  {
    "id": "nat-gateway",
    "name": "NAT Gateway",
    "category": "Networking",
    "oneLiner": "A managed AWS service that lets instances in a private subnet initiate outbound internet traffic without being reachable from the internet.",
    "specifics": [
      "Must be deployed in a PUBLIC subnet (one with a route to an Internet Gateway) and needs an Elastic IP",
      "AZ-scoped: a NAT Gateway only serves subnets routed to it within its own AZ; deploy one per AZ for AZ-independent fault tolerance",
      "Billed per NAT Gateway-hour plus a per-GB data processing charge, regardless of traffic direction",
      "Fully managed by AWS: no patching, no bandwidth configuration, and it scales automatically up to very high throughput",
      "Private subnet route tables send 0.0.0.0/0 traffic to the NAT Gateway's ID, not to the Internet Gateway directly",
      "Does not reduce data transfer cost for traffic to S3 or DynamoDB — routing that through a Gateway VPC endpoint bypasses the NAT Gateway (and its per-GB fee) entirely"
    ],
    "bestFor": [
      "Private-subnet instances (app/DB servers) that need outbound internet access for updates or third-party API calls, but must never accept inbound connections",
      "Production workloads needing a highly available, low-maintenance NAT solution instead of self-managed NAT instances",
      "Multi-AZ architectures where a NAT Gateway per AZ avoids cross-AZ data transfer charges and single-AZ failure impact"
    ],
    "watchOutFor": [
      "A single NAT Gateway in one AZ becomes a single point of failure and incurs cross-AZ charges for traffic from other AZs' private subnets",
      "Data processing charges apply per GB through the NAT Gateway — routing S3/DynamoDB traffic through it instead of a Gateway endpoint wastes money"
    ],
    "distinguishFrom": [
      {
        "service": "Internet Gateway",
        "note": "A NAT Gateway provides one-way outbound-only internet access for private subnets; an Internet Gateway provides two-way access for resources with public IPs in public subnets."
      }
    ],
    "triggers": [
      {
        "when": "private-subnet instances need outbound internet access but must never accept inbound connections",
        "pick": "NAT Gateway"
      },
      {
        "when": "need a managed, low-maintenance, highly available NAT solution instead of self-managed NAT instances",
        "pick": "NAT Gateway"
      },
      {
        "when": "avoiding a single point of failure or cross-AZ charges for NAT across multiple AZs",
        "pick": "NAT Gateway (deploy one per AZ)"
      }
    ]
  },
  {
    "id": "internet-gateway",
    "name": "Internet Gateway",
    "category": "Networking",
    "oneLiner": "A horizontally scaled, highly available VPC component that enables two-way communication between a VPC and the internet.",
    "specifics": [
      "One Internet Gateway can be attached to exactly one VPC at a time, and a VPC can have only one attached",
      "Regional, redundant, and highly available by design; no bandwidth constraints or availability configuration needed",
      "No hourly or data transfer charge for the gateway itself (standard AWS data transfer-out rates still apply)",
      "Performs 1:1 NAT for instances with a public IP, translating between the private IP and the mapped public/Elastic IP",
      "A subnet is only 'public' because its route table has a route to the Internet Gateway for 0.0.0.0/0"
    ],
    "bestFor": [
      "Giving public-facing resources (load balancers, bastion hosts, public web servers) direct inbound and outbound internet reachability",
      "Any VPC design that needs a public subnet tier fronting private application or data tiers"
    ],
    "watchOutFor": [
      "Attaching an Internet Gateway alone does nothing without a corresponding route table entry and the instance having a public/Elastic IP"
    ],
    "distinguishFrom": [
      {
        "service": "NAT Gateway",
        "note": "An Internet Gateway gives resources with public IPs direct two-way internet access; a NAT Gateway gives private-subnet resources one-way outbound-only access."
      }
    ],
    "triggers": [
      {
        "when": "public-facing resources like load balancers or bastion hosts need direct two-way internet reachability",
        "pick": "Internet Gateway"
      },
      {
        "when": "designing a public subnet tier fronting private application/data tiers",
        "pick": "Internet Gateway"
      },
      {
        "when": "gateway is attached but instances still can't reach the internet",
        "pick": "Internet Gateway (also needs a route table entry and a public/Elastic IP on the instance)"
      }
    ]
  },
  {
    "id": "vpc-endpoints",
    "name": "VPC Endpoints",
    "category": "Networking",
    "oneLiner": "A private connection from your VPC to supported AWS services that keeps traffic on the AWS network instead of traversing the public internet.",
    "specifics": [
      "Two types: Gateway endpoints, which only support Amazon S3 and DynamoDB, and Interface endpoints (powered by AWS PrivateLink), which support most other AWS and partner services",
      "Gateway endpoints are free and work by adding a target entry to your route table",
      "Interface endpoints create an ENI with a private IP in your subnet and are billed per endpoint-hour plus per-GB data processed",
      "Which subnets can use a Gateway endpoint is controlled by route table association, not the endpoint policy — the endpoint policy is a resource-based policy controlling which principals can do what through the endpoint (e.g. which S3 buckets or DynamoDB tables), not which subnets can reach it. Interface endpoints get a private DNS name resolving inside the VPC.",
      "Traffic never leaves the AWS network, avoiding NAT Gateway and Internet Gateway data processing charges for that traffic"
    ],
    "bestFor": [
      "Private EC2/Lambda workloads that need to reach S3 or DynamoDB without routing through a NAT Gateway or Internet Gateway",
      "Meeting compliance requirements that traffic to AWS services never traverse the public internet",
      "Reaching most other AWS services (e.g. SNS, SQS, Kinesis, Secrets Manager) privately from a subnet with no internet route, via an Interface endpoint"
    ],
    "watchOutFor": [
      "Choosing Gateway endpoint for a service other than S3/DynamoDB is impossible — everything else must use an Interface endpoint"
    ],
    "distinguishFrom": [
      {
        "service": "Gateway vs Interface endpoint tradeoff",
        "note": "Covered in depth in the dedicated comparison card.",
        "comparisonId": "cmp-endpoints"
      }
    ],
    "triggers": [
      {
        "when": "private EC2/Lambda need to reach S3 or DynamoDB without routing through a NAT Gateway",
        "pick": "VPC Endpoints (Gateway endpoint)"
      },
      {
        "when": "traffic to AWS services must never traverse the public internet",
        "pick": "VPC Endpoints"
      },
      {
        "when": "subnet with no internet route needs to privately reach SNS, SQS, Kinesis, or Secrets Manager",
        "pick": "VPC Endpoints (Interface endpoint)"
      }
    ]
  },
  {
    "id": "privatelink",
    "name": "AWS PrivateLink",
    "category": "Networking",
    "oneLiner": "The underlying technology that provides private connectivity between VPCs and services, powering Interface VPC endpoints without exposing traffic to the public internet.",
    "specifics": [
      "Implemented as Interface endpoints: an ENI with a private IP placed directly in your subnet(s)",
      "Lets you expose your own application as a service to other VPCs (including other AWS accounts) via an Endpoint Service backed by a Network Load Balancer or Gateway Load Balancer",
      "Consumer VPC and provider VPC never need CIDR ranges to avoid overlapping, since no peering or routing between the full VPCs occurs — only the specific endpoint",
      "Billed per endpoint-hour plus per-GB data processed through the endpoint",
      "Traffic stays on the AWS backbone and does not require an Internet Gateway, NAT Gateway, VPC peering, or Transit Gateway"
    ],
    "bestFor": [
      "SaaS or internal platform teams exposing an API/service privately to many consumer VPCs/accounts without peering each one",
      "Connecting to AWS services (most services other than S3/DynamoDB) privately from within a VPC",
      "Avoiding full network-level connectivity (peering) when only a single service/application needs to be reachable"
    ],
    "watchOutFor": [
      "PrivateLink exposes a single application/service endpoint, not full network reachability — it's not a substitute for peering or Transit Gateway when broad multi-service connectivity is needed"
    ],
    "distinguishFrom": [
      {
        "service": "VPC Peering",
        "note": "PrivateLink exposes one specific service via a private ENI without connecting the two VPC networks; peering connects the entire networks of both VPCs so all resources can potentially reach each other."
      }
    ],
    "triggers": [
      {
        "when": "SaaS or platform team wants to expose an API/service privately to many consumer VPCs/accounts without peering each one",
        "pick": "AWS PrivateLink"
      },
      {
        "when": "only a single service/application needs to be reachable, not full network-level connectivity",
        "pick": "AWS PrivateLink"
      }
    ]
  },
  {
    "id": "vpc-peering",
    "name": "VPC Peering",
    "category": "Networking",
    "oneLiner": "A direct, private network connection between two VPCs that lets resources in each communicate as if on the same network.",
    "specifics": [
      "One-to-one connection between exactly two VPCs; there is no transitive routing (peering A-B and B-C does not let A reach C)",
      "Works across accounts and across regions (inter-region peering), with traffic staying on the AWS backbone",
      "Peered VPCs must NOT have overlapping CIDR blocks",
      "Requires a route table entry in each VPC pointing the peer's CIDR at the peering connection; security groups/NACLs still apply",
      "No hourly charge for the peering connection itself; standard data transfer rates apply to traffic across it"
    ],
    "bestFor": [
      "Simple, low-cost connectivity between a small, stable number of VPCs (e.g. two VPCs sharing resources)",
      "Cross-account or cross-region private connectivity without deploying additional networking infrastructure"
    ],
    "watchOutFor": [
      "Lack of transitive routing makes peering unmanageable at scale — a full mesh of N VPCs needs N(N-1)/2 peering connections"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Transit Gateway",
        "note": "Full tradeoff covered in the dedicated comparison card.",
        "comparisonId": "cmp-peering-tgw"
      }
    ],
    "triggers": [
      {
        "when": "need simple, low-cost direct connectivity between a small, stable number of VPCs",
        "pick": "VPC Peering"
      },
      {
        "when": "need cross-account or cross-region private connectivity without deploying extra networking infrastructure",
        "pick": "VPC Peering"
      },
      {
        "when": "N VPCs would require a full mesh of N(N-1)/2 connections and no transitive routing",
        "pick": "VPC Peering (unmanageable at scale - consider Transit Gateway)"
      }
    ]
  },
  {
    "id": "transit-gateway",
    "name": "AWS Transit Gateway",
    "category": "Networking",
    "oneLiner": "A managed regional hub that interconnects thousands of VPCs and on-premises networks through a single gateway, with transitive routing.",
    "specifics": [
      "Regional resource (can be extended across regions via inter-region peering) supporting attachments from thousands of VPCs, VPNs, and Direct Connect gateways",
      "Provides transitive routing: attach each VPC once to the Transit Gateway and it can reach every other attached network, unlike peering's mesh requirement",
      "Route tables on the Transit Gateway itself let you segment attachments into isolated routing domains when needed",
      "Billed per attachment-hour plus per-GB of data processed through the gateway",
      "Acts as a hub-and-spoke model, simplifying network topology as the number of VPCs grows"
    ],
    "bestFor": [
      "Connecting many VPCs (dozens to thousands) and on-premises networks without managing a full peering mesh",
      "Centralizing and simplifying hybrid connectivity (VPN/Direct Connect) so all VPCs share a single ingress/egress point",
      "Segmenting network traffic between groups of VPCs (e.g. prod vs non-prod) using distinct Transit Gateway route tables"
    ],
    "watchOutFor": [
      "Higher cost and complexity than peering for just two or a handful of VPCs — it's the scale-out solution, not the default choice"
    ],
    "distinguishFrom": [
      {
        "service": "VPC Peering",
        "note": "Full tradeoff covered in the dedicated comparison card.",
        "comparisonId": "cmp-peering-tgw"
      }
    ],
    "triggers": [
      {
        "when": "connecting dozens to thousands of VPCs and on-premises networks without managing a full peering mesh",
        "pick": "AWS Transit Gateway"
      },
      {
        "when": "need transitive routing so each VPC attaches once and can reach every other attached network",
        "pick": "AWS Transit Gateway"
      },
      {
        "when": "need to segment traffic between groups of VPCs, e.g. prod vs non-prod",
        "pick": "AWS Transit Gateway (distinct route tables)"
      }
    ]
  },
  {
    "id": "direct-connect",
    "name": "AWS Direct Connect",
    "category": "Networking",
    "oneLiner": "A dedicated, private, high-bandwidth network connection from your premises to AWS that bypasses the public internet.",
    "specifics": [
      "Dedicated connections offer fixed 1/10/100/400 Gbps ports via a physical cross-connect; hosted connections/VIFs are lower-speed options resold through APN partners.",
      "Three virtual interface types: private VIF (reaches a VPC via VGW or DX Gateway), public VIF (reaches public AWS service endpoints), transit VIF (reaches a Transit Gateway).",
      "Traffic is NOT encrypted by default; layer MACsec or an IPsec VPN on top if encryption in transit is required.",
      "Direct Connect Gateway lets a single DX connection reach multiple VPCs across multiple Regions via private VIFs, including VPCs in other AWS accounts through a cross-account gateway association.",
      "Billed by port-hours plus outbound data transfer; physical provisioning typically takes weeks, so it is not suited to urgent connectivity needs."
    ],
    "bestFor": [
      "Hybrid workloads with large, steady, or bursty data transfer where internet-based bandwidth or cost is a bottleneck.",
      "Workloads needing stable, consistent low-latency connectivity for compliance or performance reasons.",
      "Connecting many VPCs across Regions from one physical connection using Direct Connect Gateway."
    ],
    "watchOutFor": [
      "Not encrypted in transit by default, unlike Site-to-Site VPN.",
      "Long lead time to provision; a single connection/location is a single point of failure without a second connection for resiliency."
    ],
    "distinguishFrom": [
      {
        "service": "AWS Site-to-Site VPN",
        "note": "DX is a dedicated private link with a weeks-long setup; VPN is an internet-based IPsec tunnel you can stand up in minutes.",
        "comparisonId": "cmp-dx-vpn"
      }
    ],
    "triggers": [
      {
        "when": "hybrid workload has large, steady, or bursty data transfer where internet bandwidth/cost is a bottleneck",
        "pick": "AWS Direct Connect"
      },
      {
        "when": "need stable, consistent low-latency dedicated connectivity for compliance or performance",
        "pick": "AWS Direct Connect"
      },
      {
        "when": "need one physical connection to reach multiple VPCs across multiple Regions/accounts",
        "pick": "AWS Direct Connect (via Direct Connect Gateway)"
      }
    ]
  },
  {
    "id": "site-to-site-vpn",
    "name": "AWS Site-to-Site VPN",
    "category": "Networking",
    "oneLiner": "An IPsec VPN connection over the public internet linking your on-premises network to a VPC or Transit Gateway.",
    "specifics": [
      "Every VPN connection provisions exactly 2 tunnels, terminating at two different AZ endpoints, for redundancy.",
      "Runs as encrypted IPsec tunnels over the public internet, so throughput and latency vary with internet conditions.",
      "Terminates on a Virtual Private Gateway (VGW) or a Transit Gateway; software-based setup can complete in minutes.",
      "Billed per VPN connection-hour plus data transfer; no physical provisioning is required.",
      "To scale throughput beyond a single tunnel, you need ECMP across multiple tunnels/connections, and ECMP requires a Transit Gateway — a VGW cannot do it."
    ],
    "bestFor": [
      "Quick or temporary hybrid connectivity that doesn't justify a Direct Connect circuit.",
      "A backup path for an existing Direct Connect connection.",
      "Low-to-moderate bandwidth needs, or connecting many VPCs/on-prem sites through a Transit Gateway."
    ],
    "watchOutFor": [
      "Trap: to increase throughput, candidates try to add tunnels to a VGW — ECMP load balancing across tunnels only works with a Transit Gateway attachment, not a VGW.",
      "A single VPN connection is always capped at its 2 tunnels regardless of attachment type."
    ],
    "distinguishFrom": [
      {
        "service": "AWS Direct Connect",
        "note": "VPN is internet-based and fast to set up but variable in performance; DX is a dedicated private circuit with predictable performance but a long lead time.",
        "comparisonId": "cmp-dx-vpn"
      }
    ],
    "triggers": [
      {
        "when": "need quick or temporary hybrid connectivity that doesn't justify a Direct Connect circuit",
        "pick": "AWS Site-to-Site VPN"
      },
      {
        "when": "need a backup path for an existing Direct Connect connection",
        "pick": "AWS Site-to-Site VPN"
      },
      {
        "when": "candidate adds tunnels to a Virtual Private Gateway to scale VPN throughput",
        "pick": "AWS Site-to-Site VPN (ECMP requires a Transit Gateway attachment, not a VGW)"
      }
    ]
  },
  {
    "id": "client-vpn",
    "name": "AWS Client VPN",
    "category": "Networking",
    "oneLiner": "A managed OpenVPN-based service that lets individual end-user devices securely connect into your VPC or on-premises network.",
    "specifics": [
      "Client-based (user/device-to-network), not site-to-site — each remote user runs OpenVPN-compatible client software to connect.",
      "Supports Active Directory, SAML-based federated, and mutual certificate authentication, and can be combined for multi-factor setups.",
      "Can be configured for split-tunnel (only VPC-bound traffic routed) or full-tunnel (all client traffic routed through AWS).",
      "A Client VPN endpoint associates with subnets in a VPC and can also route on to on-premises networks.",
      "Billed by endpoint-association-hour plus per-connection-hour while clients are connected."
    ],
    "bestFor": [
      "Remote employees needing secure access to VPC resources or, via routing, an on-premises network.",
      "Replacing a traditional corporate VPN concentrator with a managed, elastic service.",
      "Access that must work for individual users from anywhere with internet, not a fixed site."
    ],
    "watchOutFor": [
      "Requires client software on each end-user device; it is not a network-to-network tunnel like Site-to-Site VPN."
    ],
    "distinguishFrom": [
      {
        "service": "AWS Site-to-Site VPN",
        "note": "Client VPN connects individual remote users/devices to AWS; Site-to-Site VPN connects two whole networks (on-prem gateway to VPC/Transit Gateway)."
      }
    ],
    "triggers": [
      {
        "when": "individual remote employees need secure access to VPC or on-prem resources from anywhere with internet",
        "pick": "AWS Client VPN"
      },
      {
        "when": "replacing a traditional corporate VPN concentrator with a managed, elastic service",
        "pick": "AWS Client VPN"
      }
    ]
  },
  {
    "id": "route53",
    "name": "Amazon Route 53",
    "category": "Networking",
    "oneLiner": "AWS's highly available, scalable managed DNS service, which also offers domain registration and resource health checking.",
    "specifics": [
      "Simple routing returns one static answer (or a random pick among several) with no health checking; it's the default for a single resource.",
      "Weighted routing splits traffic across records by assigned weight, e.g. blue/green canary rollouts.",
      "Latency-based routing sends users to the Region with the lowest measured latency; it only helps once resources exist in 2+ Regions.",
      "Failover routing pairs a primary and secondary record with health checks for active/passive disaster recovery.",
      "Geolocation routes by the user's geographic location (compliance/content restriction); geoproximity biases traffic by distance and requires Traffic Flow; multivalue answer returns up to 8 healthy, health-checked records per query — not a load balancer replacement.",
      "Alias records point a zone apex to AWS resources (ALB, CloudFront, S3) with no extra query charge; Route 53 Resolver provides hybrid DNS between a VPC and on-premises via inbound/outbound endpoints."
    ],
    "bestFor": [
      "Authoritative DNS for public or private domains with health-check-driven failover.",
      "Multi-region active-active or active-passive architectures needing latency-based or failover routing.",
      "Canary/blue-green deployments using weighted routing.",
      "Hybrid DNS resolution between on-premises networks and a VPC via Resolver endpoints."
    ],
    "watchOutFor": [
      "Multivalue answer is simple health-checked DNS distribution, not a substitute for an actual load balancer.",
      "Geoproximity is often confused with geolocation — geoproximity needs Traffic Flow and bias values, geolocation just matches user location to a rule."
    ],
    "distinguishFrom": [
      {
        "service": "Elastic Load Balancing",
        "note": "Route 53 routes at the DNS level (which IP a client resolves to); ELB actively load-balances and inspects live L4/L7 traffic after connection."
      }
    ],
    "triggers": [
      {
        "when": "single resource just needs one static DNS answer with no health checking",
        "pick": "Route 53 (simple routing)"
      },
      {
        "when": "blue/green canary rollout splitting traffic by percentage across record versions",
        "pick": "Route 53 (weighted routing)"
      },
      {
        "when": "send users to whichever Region gives the lowest measured latency, resources in 2+ Regions",
        "pick": "Route 53 (latency-based routing)"
      },
      {
        "when": "active/passive disaster recovery with a primary and secondary record plus health checks",
        "pick": "Route 53 (failover routing)"
      }
    ]
  },
  {
    "id": "cloudfront",
    "name": "Amazon CloudFront",
    "category": "Networking",
    "oneLiner": "AWS's content delivery network that caches and delivers HTTP/HTTPS content from edge locations close to users.",
    "specifics": [
      "Origins can be S3, an ALB/EC2, or any custom HTTP(S) origin.",
      "Supports TCP-based HTTP/HTTPS only — it does not accelerate UDP-based or non-HTTP traffic.",
      "Origin Access Control (OAC) restricts an S3 origin so it's only reachable through CloudFront, not directly from the internet.",
      "Signed URLs/cookies restrict access to private content; CloudFront Functions and Lambda@Edge run lightweight logic at the edge.",
      "Billed by data transfer out and request count, with pricing that varies by edge-location price class."
    ],
    "bestFor": [
      "Caching and globally distributing static or dynamic HTTP(S) web content to reduce latency.",
      "Offloading repetitive request traffic from an origin server.",
      "Shielding origins like S3 or an ALB from direct public exposure."
    ],
    "watchOutFor": [
      "CloudFront is TCP/HTTP(S) only — it cannot help with UDP-based or non-HTTP protocols such as gaming or VoIP traffic; that's what Global Accelerator is for."
    ],
    "distinguishFrom": [
      {
        "service": "AWS Global Accelerator",
        "note": "CloudFront caches HTTP(S) content at the edge; Global Accelerator improves routing performance for any TCP/UDP traffic without caching.",
        "comparisonId": "cmp-cloudfront-ga"
      }
    ],
    "triggers": [
      {
        "when": "cache and globally distribute static or dynamic HTTP(S) web content to reduce latency",
        "pick": "Amazon CloudFront"
      },
      {
        "when": "need to shield an S3 bucket or ALB origin from direct public exposure",
        "pick": "Amazon CloudFront (Origin Access Control)"
      }
    ]
  },
  {
    "id": "global-accelerator",
    "name": "AWS Global Accelerator",
    "category": "Networking",
    "oneLiner": "A networking service that improves availability and performance for TCP/UDP applications using AWS's global network and static Anycast IPs.",
    "specifics": [
      "Provides 2 static Anycast IP addresses as a fixed entry point for your application.",
      "Operates at the network layer (TCP and UDP), so it supports non-HTTP protocols like gaming, VoIP, and IoT — unlike CloudFront.",
      "Routes client traffic onto AWS's private global backbone toward the closest healthy endpoint (ALB, NLB, EC2, or Elastic IP).",
      "Performs automatic failover to healthy endpoints in another Region or AZ without waiting on DNS TTL/propagation.",
      "Billed as a fixed fee per accelerator-hour plus a data transfer premium."
    ],
    "bestFor": [
      "Non-HTTP TCP/UDP workloads needing improved global performance and fast failover.",
      "Applications that need fast regional failover without DNS propagation delay.",
      "Applications needing static entry-point IPs, e.g. for client-side firewall allowlisting."
    ],
    "watchOutFor": [
      "It is not a caching/CDN service — it improves the network path only, and costs more than CloudFront for pure content-delivery use cases."
    ],
    "distinguishFrom": [
      {
        "service": "Amazon CloudFront",
        "note": "Global Accelerator improves routing for any TCP/UDP traffic without caching content; CloudFront caches HTTP(S) content at edge locations.",
        "comparisonId": "cmp-cloudfront-ga"
      }
    ],
    "triggers": [
      {
        "when": "need a fixed static IP entry point for client-side firewall allowlisting",
        "pick": "AWS Global Accelerator"
      },
      {
        "when": "non-HTTP TCP/UDP workload like gaming, VoIP, or IoT needs improved global performance",
        "pick": "AWS Global Accelerator"
      },
      {
        "when": "need fast regional/AZ failover without waiting on DNS TTL/propagation",
        "pick": "AWS Global Accelerator"
      }
    ]
  },
  {
    "id": "elb",
    "name": "Elastic Load Balancing (ALB/NLB)",
    "category": "Networking",
    "oneLiner": "AWS's managed load balancing service, offered as Application (L7), Network (L4), and Gateway (L3) load balancers.",
    "specifics": [
      "ALB operates at Layer 7 (HTTP/HTTPS) with path/host-based routing, WebSockets, and container/Lambda targets.",
      "NLB operates at Layer 4 (TCP/UDP/TLS), preserves the client source IP, supports static/Elastic IPs, and handles ultra-high request volumes at very low latency.",
      "Gateway Load Balancer operates at Layer 3 and transparently distributes traffic to third-party virtual appliances (firewalls, IDS/IPS) using GENEVE encapsulation.",
      "All types bill by load-balancer-hour plus capacity units (LCU/NLCU/GLCU) based on usage dimensions.",
      "Cross-zone load balancing distributes traffic evenly across targets in all enabled AZs; default enablement differs by load balancer type."
    ],
    "bestFor": [
      "ALB for HTTP(S) microservices/containers needing content-based routing rules.",
      "NLB for extreme performance, static IP requirements, or non-HTTP TCP/UDP traffic.",
      "Gateway Load Balancer for inserting third-party security appliances inline without redesigning the network."
    ],
    "watchOutFor": [
      "Picking ALB for a raw TCP workload that needs a static IP or the lowest possible latency, or picking NLB when content-based routing is required."
    ],
    "distinguishFrom": [
      {
        "service": "NLB vs ALB",
        "note": "ALB understands HTTP semantics and routes on content; NLB is a fast, protocol-agnostic Layer 4 balancer that preserves source IP.",
        "comparisonId": "cmp-alb-nlb"
      }
    ],
    "triggers": [
      {
        "when": "HTTP(S) microservices/containers need path- or host-based content routing",
        "pick": "Application Load Balancer (ALB)"
      },
      {
        "when": "need to preserve client source IP, a static/Elastic IP, or ultra-high-volume low-latency TCP/UDP handling",
        "pick": "Network Load Balancer (NLB)"
      },
      {
        "when": "need to insert third-party firewall/IDS/IPS appliances inline without redesigning the network",
        "pick": "Gateway Load Balancer (GWLB)"
      }
    ]
  },
  {
    "id": "vpc-flow-logs",
    "name": "VPC Flow Logs",
    "category": "Networking",
    "oneLiner": "A feature that captures metadata about IP traffic to and from network interfaces in a VPC for monitoring and troubleshooting.",
    "specifics": [
      "Can be enabled at the VPC, subnet, or individual ENI level, capturing accepted, rejected, or all traffic.",
      "Records connection metadata only (source/destination IP, port, protocol, bytes, ACCEPT/REJECT action) — never packet payload/content.",
      "Can publish to CloudWatch Logs, S3, or Kinesis Data Firehose for analysis and long-term storage.",
      "Excludes certain traffic by default, including traffic to the Amazon-provided DNS resolver, DHCP traffic, and instance metadata service (169.254.169.254) requests.",
      "Delivery is near-real-time, not instantaneous — expect a short delay before log records appear."
    ],
    "bestFor": [
      "Diagnosing why traffic is being blocked, e.g. security group or NACL misconfiguration.",
      "Security monitoring and anomaly detection across network traffic patterns.",
      "Compliance-driven audit logging of network activity."
    ],
    "watchOutFor": [
      "Not a packet sniffer or deep packet inspection tool — no payload/content is captured.",
      "Certain traffic types (DNS to the Amazon resolver, DHCP, metadata service) are excluded by default and won't appear in logs."
    ],
    "triggers": [
      {
        "when": "diagnosing why traffic is being blocked, e.g. a security group or NACL misconfiguration",
        "pick": "VPC Flow Logs"
      },
      {
        "when": "need source/destination IP, port, protocol, and ACCEPT/REJECT metadata for network audit or anomaly detection",
        "pick": "VPC Flow Logs"
      }
    ]
  },
  {
    "id": "ena-efa",
    "name": "Elastic Network Adapter / Elastic Fabric Adapter",
    "category": "Networking",
    "oneLiner": "ENA is EC2's standard high-performance network interface; EFA extends it with OS-bypass for tightly-coupled HPC and ML workloads.",
    "specifics": [
      "ENA (Elastic Network Adapter) delivers high-bandwidth networking with low CPU overhead — up to 200 Gbps on newer networking-optimized instance families, lower caps on older/smaller types — and is used by virtually all modern EC2 instance types.",
      "EFA (Elastic Fabric Adapter) is an ENA variant that adds an OS-bypass hardware interface for low-latency, high-throughput inter-node communication.",
      "EFA supports standard HPC interfaces like MPI and NCCL for tightly-coupled distributed computing and ML training.",
      "EFA is offered as an optional add-on on select instance types at no extra charge beyond the instance itself.",
      "EFA's OS-bypass performance benefit applies to traffic between instances within the same cluster/Availability Zone, typically inside a cluster placement group."
    ],
    "bestFor": [
      "ENA for general-purpose, high-throughput EC2 networking on virtually any workload.",
      "EFA for HPC workloads using MPI, and distributed deep-learning training (e.g. NCCL) needing the lowest possible inter-node latency at scale."
    ],
    "watchOutFor": [
      "EFA's OS-bypass benefit requires a cluster placement group and instance types that explicitly support EFA — not all instance types do."
    ],
    "triggers": [
      {
        "when": "general-purpose high-throughput EC2 networking needed on virtually any instance type",
        "pick": "Elastic Network Adapter (ENA)"
      },
      {
        "when": "HPC workload using MPI, or distributed ML training with NCCL, needs the lowest possible inter-node latency at scale",
        "pick": "Elastic Fabric Adapter (EFA)"
      },
      {
        "when": "need OS-bypass networking between instances in a cluster placement group",
        "pick": "Elastic Fabric Adapter (EFA)"
      }
    ]
  },
  {
    "id": "iam",
    "name": "AWS IAM",
    "category": "Security & Identity",
    "oneLiner": "The global service that controls who (or what) can do what across your AWS account via users, groups, roles, and policies.",
    "specifics": [
      "IAM is global, not regional — users, roles, and policies apply across all regions.",
      "Free to use; you pay only for the resources those identities access.",
      "Policy evaluation: an explicit Deny always wins, otherwise access is denied by default unless an Allow exists in an identity-based or resource-based policy. A permissions boundary never grants anything by itself — it only caps the maximum an identity policy can grant.",
      "Roles provide temporary credentials (via STS) instead of long-lived access keys — the standard way for EC2, Lambda, or other AWS services to call other AWS APIs.",
      "IAM users/groups are best for a small number of individually managed identities within one account; not built for federating large workforces or many accounts."
    ],
    "bestFor": [
      "Granting an EC2 instance or Lambda function permission to call other AWS services without storing credentials.",
      "Defining fine-grained least-privilege permissions for a single AWS account.",
      "Cross-account access via role assumption (AssumeRole) instead of sharing keys.",
      "Enforcing MFA and access boundaries for a small set of human or service identities."
    ],
    "watchOutFor": [
      "Long-lived IAM user access keys are a common exam 'wrong answer' when a role would avoid storing credentials entirely.",
      "IAM alone doesn't scale well for many human users across many accounts — that's IAM Identity Center's job."
    ],
    "distinguishFrom": [
      {
        "service": "AWS IAM Identity Center",
        "note": "IAM manages account-scoped users/roles for workloads and individual access; Identity Center manages human workforce single sign-on across multiple AWS accounts via centrally assigned permission sets."
      },
      {
        "service": "AWS STS",
        "note": "IAM defines the policies and roles; STS is the service that actually issues the short-lived credentials when a role is assumed."
      }
    ],
    "triggers": [
      {
        "when": "EC2 instance or Lambda function needs permission to call other AWS services without storing credentials",
        "pick": "AWS IAM (role)"
      },
      {
        "when": "Question hints at long-lived access keys when a role would avoid storing credentials entirely",
        "pick": "AWS IAM role (not access keys)"
      },
      {
        "when": "Cross-account access needed via role assumption instead of sharing keys",
        "pick": "AWS IAM (AssumeRole)"
      },
      {
        "when": "Need fine-grained least-privilege permissions within a single AWS account",
        "pick": "AWS IAM"
      }
    ]
  },
  {
    "id": "iam-identity-center",
    "name": "AWS IAM Identity Center",
    "category": "Security & Identity",
    "oneLiner": "Centralized single sign-on for human users across multiple AWS accounts and business applications, formerly called AWS SSO.",
    "specifics": [
      "Integrates with AWS Organizations to grant workforce access across many accounts from one place.",
      "Uses permission sets (templates of IAM policies) assigned to users or groups per account, rather than per-account IAM users.",
      "Supports an internal identity store or federation with an external identity provider (e.g. Okta, Azure AD, on-prem AD via Directory Service).",
      "No per-user licensing cost from AWS for the core service; you authenticate once and switch between assigned accounts/roles from a single portal."
    ],
    "bestFor": [
      "Giving employees single sign-on access to multiple AWS accounts in an AWS Organizations setup.",
      "Centrally managing workforce permissions instead of creating IAM users in every account.",
      "Federating an existing corporate identity provider (SAML/OIDC) for AWS console and CLI access."
    ],
    "watchOutFor": [
      "It's for human workforce access, not for granting an application or service permissions — that's still IAM roles.",
      "Requires AWS Organizations to manage multiple accounts; a single-account setup gets less benefit from it."
    ],
    "distinguishFrom": [
      {
        "service": "AWS IAM",
        "note": "Identity Center is the multi-account, human-SSO layer built on top of per-account IAM roles/permission sets — it doesn't replace IAM within each account."
      },
      {
        "service": "Amazon Cognito",
        "note": "Identity Center authenticates employees/workforce into AWS accounts and consoles; Cognito authenticates end users of your own applications."
      }
    ],
    "triggers": [
      {
        "when": "Employees need single sign-on across multiple AWS accounts in an Organizations setup",
        "pick": "IAM Identity Center"
      },
      {
        "when": "Want to centrally manage workforce permissions instead of creating IAM users in every account",
        "pick": "IAM Identity Center"
      },
      {
        "when": "Need to federate an existing corporate identity provider (SAML/OIDC) for console/CLI access",
        "pick": "IAM Identity Center"
      }
    ]
  },
  {
    "id": "cognito",
    "name": "Amazon Cognito",
    "category": "Security & Identity",
    "oneLiner": "A managed service that adds sign-up, sign-in, and access control for the end users of your web or mobile applications.",
    "specifics": [
      "Two building blocks: User Pools (user directory, authentication, sign-up/sign-in) and Identity Pools (issue temporary AWS credentials to access AWS resources).",
      "Supports social identity providers (Google, Facebook, Apple) and SAML/OIDC federation for user sign-in.",
      "Pricing is typically based on monthly active users (MAUs), not a flat fee.",
      "Issues JSON Web Tokens (JWTs) after authentication, which can be validated by API Gateway or application backends."
    ],
    "bestFor": [
      "Adding customer-facing sign-up/sign-in to a mobile or web app without building your own user directory.",
      "Letting authenticated app users obtain temporary AWS credentials to access S3, DynamoDB, or other AWS resources directly.",
      "Federating social or enterprise identity providers for end-user login."
    ],
    "watchOutFor": [
      "User Pool and Identity Pool solve different problems and are often used together — mixing them up is a common exam trap."
    ],
    "distinguishFrom": [
      {
        "service": "Cognito Identity Pool",
        "note": "User Pool vs Identity Pool tradeoff.",
        "comparisonId": "cmp-cognito-pools"
      },
      {
        "service": "AWS IAM Identity Center",
        "note": "Cognito is for your application's end users (customers); Identity Center is for your organization's workforce accessing AWS accounts."
      }
    ],
    "triggers": [
      {
        "when": "Need customer-facing sign-up/sign-in for a mobile or web app without building a user directory",
        "pick": "Amazon Cognito User Pool"
      },
      {
        "when": "Authenticated app users need temporary AWS credentials to access S3 or DynamoDB directly",
        "pick": "Amazon Cognito Identity Pool"
      },
      {
        "when": "Need to federate social logins (Google/Facebook/Apple) for end-user sign-in",
        "pick": "Amazon Cognito"
      }
    ]
  },
  {
    "id": "kms",
    "name": "AWS KMS",
    "category": "Security & Identity",
    "oneLiner": "A managed service for creating and controlling the cryptographic keys used to encrypt data across AWS services.",
    "specifics": [
      "Regional service — keys don't automatically replicate across regions (multi-region keys are a distinct, explicit feature).",
      "Billing is per key per month plus per API request (encrypt/decrypt/generate-data-key calls), not per GB of data encrypted.",
      "Supports AWS owned keys (used internally by AWS services, not visible in your account), AWS managed keys (free, AWS-controlled rotation), and customer managed keys (you control policy and rotation) — a customer managed key can optionally use imported key material (BYOK) instead of KMS-generated material.",
      "Envelope encryption model: KMS encrypts a data key, and that data key encrypts your actual data, rather than KMS encrypting large objects directly.",
      "Key policies (resource-based) combined with IAM policies control who can use or manage a key — both must allow access."
    ],
    "bestFor": [
      "Encrypting data at rest for S3, EBS, RDS, and other AWS services with centralized key management and audit trail (CloudTrail).",
      "Needing fine-grained control over who can use vs administer a specific encryption key.",
      "Meeting compliance requirements for key rotation and access auditing."
    ],
    "watchOutFor": [
      "Customer managed keys have API call quotas and per-key costs — high-throughput encryption at scale needs quota awareness.",
      "Keys are regional by default; cross-region disaster recovery designs need multi-region keys or per-region key management."
    ],
    "distinguishFrom": [
      {
        "service": "AWS Secrets Manager",
        "note": "KMS manages encryption keys used to protect data; Secrets Manager stores and rotates the actual secret values (like DB passwords), and uses KMS under the hood to encrypt them at rest."
      }
    ],
    "triggers": [
      {
        "when": "Need to encrypt data at rest for S3, EBS, or RDS with centralized key management and an audit trail",
        "pick": "AWS KMS"
      },
      {
        "when": "Need fine-grained control over who can use vs. administer a specific encryption key",
        "pick": "AWS KMS (key policy)"
      },
      {
        "when": "Compliance requires key rotation and access auditing for encryption keys",
        "pick": "AWS KMS"
      }
    ]
  },
  {
    "id": "secrets-manager",
    "name": "AWS Secrets Manager",
    "category": "Security & Identity",
    "oneLiner": "A managed service for storing, retrieving, and automatically rotating sensitive values like database credentials and API keys.",
    "specifics": [
      "Billed per secret stored per month plus per API call — it is not a free service.",
      "Native built-in automatic rotation for supported services (e.g. RDS, Redshift, DocumentDB) using an AWS-provided or custom Lambda rotation function.",
      "Secrets are encrypted at rest using KMS, and access is controlled via fine-grained IAM and resource (secret) policies.",
      "Can replicate secrets to multiple regions for multi-region applications."
    ],
    "bestFor": [
      "Storing database credentials that need automatic, scheduled rotation without application downtime.",
      "Centralizing API keys or third-party credentials with tight IAM-based access control and audit logging.",
      "Applications where secret rotation is a compliance requirement."
    ],
    "watchOutFor": [
      "Costs scale with number of secrets and API calls — using it for high-volume, low-sensitivity config is usually overkill."
    ],
    "distinguishFrom": [
      {
        "service": "AWS Systems Manager Parameter Store",
        "note": "Secrets Manager costs money but includes native automatic rotation (e.g. for RDS) and finer-grained resource policies; Parameter Store's SecureString standard tier is free and simpler, good for config values and API keys, but you must build rotation yourself (or integrate with Secrets Manager's rotation)."
      }
    ],
    "triggers": [
      {
        "when": "Database credentials need automatic, scheduled rotation without application downtime",
        "pick": "AWS Secrets Manager"
      },
      {
        "when": "Need to centralize API keys or third-party credentials with tight IAM access control and audit logging",
        "pick": "AWS Secrets Manager"
      },
      {
        "when": "Secret rotation itself is a stated compliance requirement",
        "pick": "AWS Secrets Manager"
      }
    ]
  },
  {
    "id": "systems-manager-parameter-store",
    "name": "AWS Systems Manager Parameter Store",
    "category": "Security & Identity",
    "oneLiner": "A hierarchical, managed store for configuration data and secrets, part of the broader AWS Systems Manager service.",
    "specifics": [
      "Standard tier parameters are free; an Advanced tier exists for larger values, more parameters, and parameter policies at additional cost.",
      "SecureString parameter type encrypts values using KMS; String and StringList types store plain configuration data.",
      "Supports hierarchical naming (e.g. /app/prod/db-password) for organizing and scoping IAM access to groups of parameters.",
      "No native automatic rotation built in — rotation must be self-implemented or done by integrating with Secrets Manager."
    ],
    "bestFor": [
      "Storing application configuration values and feature flags alongside occasional secrets, at low cost.",
      "Simple API keys or credentials that don't require scheduled automatic rotation.",
      "Centralized, hierarchical config management across environments (dev/staging/prod) referenced by EC2, Lambda, or CloudFormation."
    ],
    "watchOutFor": [
      "Choosing it for secrets that need automatic rotation (like frequently-rotated DB passwords) means building that rotation logic yourself — Secrets Manager is the built-in answer for that."
    ],
    "distinguishFrom": [
      {
        "service": "AWS Secrets Manager",
        "note": "See Secrets Manager's distinguishFrom note for the full tradeoff — Parameter Store is the free, simpler, no-native-rotation option."
      }
    ],
    "triggers": [
      {
        "when": "Storing app config values or feature flags alongside occasional secrets at low/no cost",
        "pick": "SSM Parameter Store"
      },
      {
        "when": "Simple API keys or credentials that don't require scheduled automatic rotation",
        "pick": "SSM Parameter Store"
      },
      {
        "when": "Need hierarchical config across dev/staging/prod referenced by EC2, Lambda, or CloudFormation",
        "pick": "SSM Parameter Store"
      }
    ]
  },
  {
    "id": "acm",
    "name": "AWS Certificate Manager",
    "category": "Security & Identity",
    "oneLiner": "A managed service that provisions, deploys, and automatically renews SSL/TLS certificates for use with AWS services.",
    "specifics": [
      "Public certificates issued by ACM for use with integrated AWS services (ALB, CloudFront, API Gateway) are free of charge.",
      "Certificates auto-renew before expiry as long as domain validation (DNS or email) can still be completed.",
      "ACM certificates cannot be exported or downloaded for use outside their integrated AWS services (except ACM Private CA use cases) — you can't install one directly on an on-prem server.",
      "Private certificates via the associated ACM Private CA are a separate, paid capability for internal/private PKI needs."
    ],
    "bestFor": [
      "Adding HTTPS to an Application Load Balancer, CloudFront distribution, or API Gateway without manually managing certificate renewal.",
      "Avoiding the operational overhead of tracking certificate expiry dates for AWS-facing endpoints."
    ],
    "watchOutFor": [
      "Because ACM public certificates aren't exportable, they're the wrong choice when you need a certificate file to install on a self-managed EC2 web server or on-prem box — a third-party CA certificate is needed there instead.",
      "DNS validation requires ongoing access to the domain's DNS records for auto-renewal to keep working."
    ],
    "triggers": [
      {
        "when": "Need HTTPS on an ALB, CloudFront distribution, or API Gateway without managing cert renewal manually",
        "pick": "AWS Certificate Manager"
      },
      {
        "when": "Want to avoid tracking certificate expiry dates for AWS-facing endpoints",
        "pick": "AWS Certificate Manager"
      }
    ]
  },
  {
    "id": "sts",
    "name": "AWS Security Token Service (STS)",
    "category": "Security & Identity",
    "oneLiner": "A global service that issues short-lived, temporary security credentials for accessing AWS resources.",
    "specifics": [
      "Free to use — there is no charge for calling STS APIs.",
      "AssumeRole is the core operation: it's what happens behind the scenes whenever an IAM role is assumed, by a user, an AWS service (EC2/Lambda), or another account.",
      "Temporary credentials consist of an access key, secret key, and session token, with a configurable expiration (as short as minutes, up to hours).",
      "Powers cross-account access patterns and is also what issues AWS credentials to Cognito Identity Pool users after authentication."
    ],
    "bestFor": [
      "Granting an EC2 instance, Lambda function, or federated user temporary access instead of long-lived credentials.",
      "Cross-account access, where a role in Account B is assumed by a principal in Account A.",
      "Any scenario where Cognito Identity Pools, IAM roles, or federation need to hand out short-lived AWS access."
    ],
    "watchOutFor": [
      "STS itself doesn't define permissions — it just issues credentials for whatever the underlying IAM role already allows."
    ],
    "distinguishFrom": [
      {
        "service": "AWS IAM",
        "note": "IAM roles define the policy/permissions; STS is the mechanism that actually mints the temporary credentials when that role is assumed."
      }
    ],
    "triggers": [
      {
        "when": "Need to grant an EC2 instance, Lambda function, or federated user temporary access instead of long-lived credentials",
        "pick": "AWS STS"
      },
      {
        "when": "Cross-account access where a role in Account B is assumed by a principal in Account A",
        "pick": "AWS STS (AssumeRole)"
      },
      {
        "when": "Cognito Identity Pool users need to be issued AWS credentials after authentication",
        "pick": "AWS STS"
      }
    ]
  },
  {
    "id": "directory-service",
    "name": "AWS Directory Service",
    "category": "Security & Identity",
    "oneLiner": "A managed service for running Microsoft Active Directory-compatible directories in AWS, or connecting to an existing on-prem AD.",
    "specifics": [
      "Offers multiple flavors: AWS Managed Microsoft AD (full, managed AD in AWS), AD Connector (a proxy to an existing on-prem AD, no data stored in AWS), and Simple AD (a lightweight, Samba-based standalone directory).",
      "Priced per directory per hour, varying by edition/size, rather than a flat fee.",
      "AWS Managed Microsoft AD supports trust relationships with on-prem AD domains for hybrid identity.",
      "Can serve as the identity source for IAM Identity Center and for domain-joining EC2 Windows/Linux instances."
    ],
    "bestFor": [
      "Running Windows workloads that require native Active Directory (e.g. for Group Policy, SQL Server AD authentication) in AWS.",
      "Extending an existing on-prem Active Directory into AWS without duplicating the user directory (AD Connector).",
      "Providing an identity source for IAM Identity Center or Amazon WorkSpaces in AD-dependent environments."
    ],
    "watchOutFor": [
      "AD Connector doesn't store any directory data in AWS — it requires reliable network connectivity back to on-prem AD, and stops working if that link is down."
    ],
    "distinguishFrom": [
      {
        "service": "AWS IAM Identity Center",
        "note": "Directory Service provides the actual directory (identities can live here); Identity Center is the SSO/access-assignment layer that can use a directory like this as its identity source."
      }
    ],
    "triggers": [
      {
        "when": "Windows workloads need native Active Directory (Group Policy, SQL Server AD auth) running in AWS",
        "pick": "AWS Directory Service (Managed Microsoft AD)"
      },
      {
        "when": "Need to extend an existing on-prem AD into AWS without duplicating the user directory",
        "pick": "AWS Directory Service (AD Connector)"
      },
      {
        "when": "Need an identity source for IAM Identity Center or WorkSpaces in an AD-dependent environment",
        "pick": "AWS Directory Service"
      }
    ]
  },
  {
    "id": "waf",
    "name": "AWS WAF",
    "category": "Security & Identity",
    "oneLiner": "A Layer 7 web application firewall that filters HTTP/HTTPS requests using rules you define or subscribe to.",
    "specifics": [
      "Attaches to CloudFront, ALB, API Gateway (REST), AppSync, or Cognito user pools — not to raw EC2/NLB traffic.",
      "Rules match on IP, headers, body, URI strings, geo location, or SQLi/XSS patterns; rule groups can be custom, AWS managed, or Marketplace.",
      "Rate-based rules block/throttle an IP once it exceeds a request threshold in a rolling window.",
      "Priced by web ACL, by rule, and by request volume processed — not a flat fee.",
      "Actions per rule are Allow, Block, Count, CAPTCHA, and Challenge — Count tests rules safely before enforcing; CAPTCHA and Challenge (added 2021-2022) act like Count for a valid/unexpired token but block on an invalid/expired one, for bot mitigation."
    ],
    "bestFor": [
      "Blocking SQL injection, XSS, and bad-bot traffic in front of a public web app or API.",
      "Rate-limiting a specific endpoint (e.g., login) to blunt credential-stuffing or scraping.",
      "Geo-restricting content at the edge with CloudFront.",
      "Virtually patching a known vulnerability before a code fix ships."
    ],
    "watchOutFor": [
      "WAF inspects application-layer content; it does not stop volumetric network/transport-layer DDoS floods — that's Shield's job.",
      "Must be explicitly associated with a resource (CloudFront distribution, ALB, etc.); it does nothing on its own."
    ],
    "distinguishFrom": [
      {
        "service": "AWS Shield",
        "note": "WAF filters HTTP request content (Layer 7 rules); Shield defends against DDoS volume/floods (Layers 3-4 plus some L7 via Advanced). They're commonly deployed together."
      },
      {
        "service": "AWS Network Firewall",
        "note": "WAF only inspects web traffic to specific supported endpoints; Network Firewall inspects general VPC network traffic across a broader protocol range."
      }
    ],
    "triggers": [
      {
        "when": "Need to block SQL injection, XSS, or bad-bot traffic in front of a public web app or API",
        "pick": "AWS WAF"
      },
      {
        "when": "Need to rate-limit a login endpoint against credential-stuffing or scraping",
        "pick": "AWS WAF (rate-based rule)"
      },
      {
        "when": "Need to geo-restrict content at the edge with CloudFront",
        "pick": "AWS WAF"
      },
      {
        "when": "Need to virtually patch a known vulnerability before a code fix ships",
        "pick": "AWS WAF"
      }
    ]
  },
  {
    "id": "shield",
    "name": "AWS Shield",
    "category": "Security & Identity",
    "oneLiner": "Managed DDoS protection for AWS resources, with a free automatic tier and a paid advanced tier.",
    "specifics": [
      "Shield Standard is free and automatically active on every AWS account, protecting against common network/transport-layer (L3/L4) DDoS attacks.",
      "Shield Advanced is a paid subscription (per organization, with a 1-year commitment) covering EC2, ELB, CloudFront, Global Accelerator, and Route 53.",
      "Advanced adds 24/7 access to the AWS DDoS Response Team (DRT), enhanced detection for larger/more sophisticated attacks, and some Layer 7 protection when paired with WAF.",
      "Advanced includes cost protection — credits against scaling charges (EC2, ELB, CloudFront, Global Accelerator, Route 53) incurred during a DDoS event.",
      "Advanced customers get WAF at no extra charge on protected resources."
    ],
    "bestFor": [
      "Standard: baseline protection every workload already has, no action needed.",
      "Advanced: internet-facing production workloads where DDoS downtime has real business or contractual cost (e.g., SLA-bound applications).",
      "Organizations wanting direct AWS incident-response support during an active attack.",
      "Financial protection against the traffic-driven cost spike a large DDoS attack can cause."
    ],
    "watchOutFor": [
      "Shield Advanced is a recurring paid commitment, not a per-incident fee — it's often over-bought for low-risk internal workloads.",
      "Standard alone gives no direct human support and no cost protection during an attack."
    ],
    "distinguishFrom": [
      {
        "service": "AWS WAF",
        "note": "Shield stops network-layer flood traffic; WAF filters malicious HTTP request content. Use both together for layered protection."
      },
      {
        "service": "AWS Network Firewall",
        "note": "Shield is purpose-built DDoS mitigation at the edge; Network Firewall is general-purpose VPC traffic filtering, not a DDoS-specialized service."
      }
    ],
    "triggers": [
      {
        "when": "Baseline DDoS protection that every AWS account already has with no setup",
        "pick": "AWS Shield Standard"
      },
      {
        "when": "Internet-facing production workload has SLA-bound cost exposure to DDoS downtime",
        "pick": "AWS Shield Advanced"
      },
      {
        "when": "Need 24/7 access to the AWS DDoS Response Team during an active attack",
        "pick": "AWS Shield Advanced"
      },
      {
        "when": "Need financial/cost protection against scaling charges caused by a DDoS event",
        "pick": "AWS Shield Advanced"
      }
    ]
  },
  {
    "id": "network-firewall",
    "name": "AWS Network Firewall",
    "category": "Security & Identity",
    "oneLiner": "A managed, stateful network firewall for inspecting and filtering traffic across an entire VPC.",
    "specifics": [
      "Deployed via firewall endpoints in subnets, typically routed through a dedicated firewall subnet per AZ.",
      "Supports stateful and stateless rule groups, domain-name filtering, and intrusion detection/prevention (IDS/IPS) style signatures.",
      "Operates at Layer 3-7, so it can inspect payload content, not just IP/port like security groups and NACLs.",
      "Priced by firewall endpoint-hour plus data processed per GB — an always-on cost, unlike security groups/NACLs which are free.",
      "Often paired with Gateway Load Balancer when routing traffic through third-party or centralized inspection appliances."
    ],
    "bestFor": [
      "Centralized, org-wide egress/ingress traffic inspection in a hub VPC (e.g., inspection VPC in a Transit Gateway design).",
      "Enforcing outbound domain allow-lists (e.g., only permit traffic to approved SaaS domains).",
      "Detecting/blocking known-bad traffic patterns (IDS/IPS signatures) that security groups can't express.",
      "Compliance requirements mandating deep packet inspection beyond stateless ACLs."
    ],
    "watchOutFor": [
      "It's a VPC-level network firewall, not a web application firewall — it won't parse HTTP semantics the way WAF does.",
      "Adds real hourly + per-GB cost and routing complexity (subnet + route table design) compared to security groups/NACLs."
    ],
    "distinguishFrom": [
      {
        "service": "AWS WAF",
        "note": "Network Firewall filters general VPC network traffic (L3-7, any protocol); WAF is specifically for HTTP(S) requests to CloudFront/ALB/API Gateway."
      },
      {
        "service": "Security groups / NACLs",
        "note": "Security groups (stateful, instance-level) and NACLs (stateless, subnet-level) only filter on IP/port/protocol; Network Firewall adds stateful deep inspection, domain filtering, and IDS/IPS signatures across the whole VPC."
      }
    ],
    "triggers": [
      {
        "when": "Need centralized, org-wide egress/ingress traffic inspection in a hub or inspection VPC",
        "pick": "AWS Network Firewall"
      },
      {
        "when": "Need to enforce outbound domain allow-lists limiting traffic to approved SaaS domains",
        "pick": "AWS Network Firewall"
      },
      {
        "when": "Need IDS/IPS signature-based detection of bad traffic patterns beyond what security groups express",
        "pick": "AWS Network Firewall"
      }
    ]
  },
  {
    "id": "security-hub",
    "name": "AWS Security Hub",
    "category": "Security & Identity",
    "oneLiner": "A dashboard that aggregates, normalizes, and prioritizes security findings from GuardDuty, Inspector, Macie, Config, and other sources.",
    "specifics": [
      "Ingests findings in the AWS Security Finding Format (ASFF) from AWS services and supported third-party tools.",
      "Runs automated checks against security standards (e.g., AWS Foundational Security Best Practices, CIS, PCI DSS) and produces a compliance score.",
      "Does not itself scan resources or evaluate configuration drift — it consumes findings/results that other services (Config, GuardDuty, Inspector) already generated.",
      "Can aggregate findings across multiple accounts and regions via a designated administrator account.",
      "Priced per finding ingested/evaluated and per security check run, not a flat subscription."
    ],
    "bestFor": [
      "Getting one unified view of security posture instead of checking GuardDuty, Inspector, Macie, and Config separately.",
      "Tracking compliance against a named standard (CIS, PCI DSS) with an automatically computed score.",
      "Triaging and prioritizing which findings need action across a multi-account organization.",
      "Feeding findings into automated response pipelines (e.g., via EventBridge to a remediation Lambda)."
    ],
    "watchOutFor": [
      "It does not remediate anything itself and does not evaluate resource configuration directly — that distinction trips up exam questions vs. Config.",
      "Requires the underlying detective services (GuardDuty, Inspector, Config, etc.) to be enabled to have anything meaningful to aggregate."
    ],
    "distinguishFrom": [
      {
        "service": "AWS Config",
        "note": "Config evaluates resource configuration against rules over time and can auto-remediate; Security Hub aggregates and scores security findings (including Config's) but doesn't evaluate configuration itself."
      },
      {
        "service": "Amazon GuardDuty",
        "note": "GuardDuty is a threat-detection source (analyzes logs for malicious/anomalous activity); Security Hub is the aggregator that collects GuardDuty's findings alongside others."
      }
    ],
    "triggers": [
      {
        "when": "Want one unified view of security posture instead of checking GuardDuty, Inspector, Macie, and Config separately",
        "pick": "AWS Security Hub"
      },
      {
        "when": "Need to track compliance against a named standard (CIS, PCI DSS) with an automatically computed score",
        "pick": "AWS Security Hub"
      },
      {
        "when": "Want to feed security findings into an automated remediation pipeline via EventBridge",
        "pick": "AWS Security Hub"
      }
    ]
  },
  {
    "id": "config",
    "name": "AWS Config",
    "category": "Security & Identity",
    "oneLiner": "A service that continuously records resource configurations and evaluates them against rules over time.",
    "specifics": [
      "Maintains a configuration history and a point-in-time configuration item for each supported resource, enabling drift and change tracking.",
      "Config Rules (AWS managed or custom, e.g., via Lambda) evaluate resources as compliant or non-compliant against a desired state.",
      "Non-compliant resources can trigger automatic remediation via associated SSM Automation documents.",
      "Conformance packs bundle a set of Config rules plus remediation actions into one deployable, org-wide template for a compliance framework.",
      "Priced per configuration item recorded and per rule evaluation, not a flat fee — cost scales with resource count and change frequency."
    ],
    "bestFor": [
      "Detecting configuration drift, e.g., an S3 bucket becoming public or a security group opening port 22 to 0.0.0.0/0.",
      "Auditing historical configuration state of a resource for a compliance investigation.",
      "Enforcing organization-wide compliance baselines at scale using conformance packs across all member accounts.",
      "Auto-remediating known-bad configurations without manual intervention."
    ],
    "watchOutFor": [
      "Config evaluates configuration state, not API activity — pair with CloudTrail if you need to know who made a change, not just that it happened.",
      "Enabling it across many resources/accounts can generate significant per-item and per-evaluation cost if not scoped carefully."
    ],
    "distinguishFrom": [
      {
        "service": "AWS CloudTrail",
        "note": "Config tracks what a resource's configuration IS and whether it complies with rules; CloudTrail logs who called which API and when, regardless of resulting configuration."
      },
      {
        "service": "AWS Security Hub",
        "note": "Config actively evaluates and can remediate configuration; Security Hub only aggregates and prioritizes findings (including Config's) without evaluating configuration itself."
      }
    ],
    "triggers": [
      {
        "when": "Need to detect configuration drift, like an S3 bucket becoming public or a security group opening port 22",
        "pick": "AWS Config"
      },
      {
        "when": "Need the historical configuration state of a resource for a compliance investigation",
        "pick": "AWS Config"
      },
      {
        "when": "Want known-bad configurations to auto-remediate without manual intervention",
        "pick": "AWS Config"
      }
    ]
  },
  {
    "id": "cloudtrail",
    "name": "AWS CloudTrail",
    "category": "Security & Identity",
    "oneLiner": "An immutable audit log of every API call made in an AWS account — who did what, when, and from where.",
    "specifics": [
      "Records management (control-plane) events by default; data events (e.g., S3 object-level, Lambda invocations) require explicit configuration and cost more.",
      "A trail can deliver logs to S3 and CloudWatch Logs, and can be applied organization-wide to capture all member accounts centrally.",
      "Log file integrity validation and delivery to a locked-down S3 bucket (e.g., with MFA delete/Object Lock) make the trail tamper-evident for audits.",
      "Event history in the console retains 90 days by default; a configured trail is needed for longer retention.",
      "Priced per data event and management event delivered beyond the free tier for one copy of management events."
    ],
    "bestFor": [
      "Forensic investigation of who made a specific change (e.g., who deleted a security group) and when.",
      "Meeting compliance requirements for an auditable record of account activity.",
      "Detecting unauthorized or anomalous API usage when combined with GuardDuty or Security Hub.",
      "Organization-wide governance via one trail capturing all accounts in AWS Organizations."
    ],
    "watchOutFor": [
      "CloudTrail records that an API call happened, not the resulting resource state — it doesn't tell you if a resource is currently compliant, that's Config.",
      "Data events (S3 object-level, Lambda) are off by default and add cost, so they're easy to overlook when investigating object-level access."
    ],
    "distinguishFrom": [
      {
        "service": "CloudWatch vs CloudTrail vs X-Ray",
        "note": "See the dedicated comparison card for how these three observability services divide responsibilities.",
        "comparisonId": "cmp-observability"
      }
    ],
    "triggers": [
      {
        "when": "Need to know who made a specific change and when, for a forensic investigation",
        "pick": "AWS CloudTrail"
      },
      {
        "when": "Compliance requires an auditable record of every API call made in the account",
        "pick": "AWS CloudTrail"
      },
      {
        "when": "Need org-wide governance via one trail capturing activity across all AWS Organizations accounts",
        "pick": "AWS CloudTrail"
      }
    ]
  },
  {
    "id": "iam-access-analyzer",
    "name": "IAM Access Analyzer",
    "category": "Security & Identity",
    "oneLiner": "A tool that identifies resources shared with entities outside your account or organization, and validates IAM policies.",
    "specifics": [
      "Uses automated reasoning (mathematical logic, not just pattern matching) to analyze resource policies for unintended external access.",
      "Covers S3 buckets, IAM roles, KMS keys, Lambda functions, SQS queues, Secrets Manager secrets, and more.",
      "Also offers policy validation/generation: checks IAM policies for errors or overly permissive statements, and can generate least-privilege policies from CloudTrail activity.",
      "An analyzer is scoped to an account or an AWS Organizations zone of trust; no additional charge for the core external-access findings feature.",
      "Findings are continuously updated as policies change — it's not a one-time scan."
    ],
    "bestFor": [
      "Discovering an S3 bucket or IAM role accidentally exposed to the public or to an untrusted external account.",
      "Validating a hand-written IAM policy for syntax errors or overly broad permissions before deploying it.",
      "Generating a least-privilege policy based on a role's actual observed CloudTrail activity.",
      "Continuous monitoring for unintended cross-account resource sharing at scale."
    ],
    "watchOutFor": [
      "It flags unintended external/cross-account access on resource policies — it does not evaluate general resource configuration compliance like Config does.",
      "Policy generation is based on historical activity, so it can miss legitimate-but-infrequent actions and under-scope the generated policy."
    ],
    "distinguishFrom": [
      {
        "service": "AWS Config",
        "note": "Access Analyzer specifically hunts for unintended external/cross-account resource sharing and validates IAM policy logic; Config evaluates broader resource configuration compliance against custom rules."
      }
    ],
    "triggers": [
      {
        "when": "Need to discover an S3 bucket or IAM role accidentally exposed to the public or an external account",
        "pick": "IAM Access Analyzer"
      },
      {
        "when": "Need to validate a hand-written IAM policy for errors or overly broad permissions before deploying",
        "pick": "IAM Access Analyzer"
      },
      {
        "when": "Want to generate a least-privilege policy from a role's actual observed CloudTrail activity",
        "pick": "IAM Access Analyzer"
      }
    ]
  },
  {
    "id": "scp",
    "name": "Service Control Policies (SCPs)",
    "category": "Security & Identity",
    "oneLiner": "Organization-level policies that set the maximum available permissions for accounts within AWS Organizations.",
    "specifics": [
      "Only functional within AWS Organizations; attached to the organization root, an OU, or an individual account.",
      "SCPs never grant permissions — they only filter/restrict what IAM policies within the account can allow, acting as a permission ceiling.",
      "The management account is not restricted by SCPs attached to it.",
      "Written in JSON similar to IAM policy syntax, using allow-lists or deny-lists (e.g., deny specific actions/regions org-wide).",
      "Effective permissions are the intersection of SCPs and the account's IAM policies — both must allow an action for it to succeed."
    ],
    "bestFor": [
      "Enforcing organization-wide guardrails, e.g., blocking use of specific regions or preventing member accounts from leaving the organization.",
      "Restricting root-user-equivalent damage even if an account's IAM admin misconfigures a policy.",
      "Standardizing which services/actions are permitted across many accounts under an OU (e.g., a sandbox OU with limited services).",
      "Preventing disabling of security services (e.g., denying CloudTrail or GuardDuty from being turned off)."
    ],
    "watchOutFor": [
      "A common trap: assuming an SCP can grant access — it cannot; the account still needs an IAM/resource policy that explicitly allows the action."
    ],
    "distinguishFrom": [
      {
        "service": "IAM policy / permission boundary",
        "note": "See the dedicated comparison card for how SCPs, IAM policies, and permission boundaries interact.",
        "comparisonId": "cmp-scp-iam-boundary"
      }
    ],
    "triggers": [
      {
        "when": "Need org-wide guardrails, like blocking specific regions or preventing accounts from leaving the organization",
        "pick": "Service Control Policies (SCPs)"
      },
      {
        "when": "Want to cap the damage possible even if an account's IAM admin misconfigures a policy",
        "pick": "Service Control Policies (SCPs)"
      },
      {
        "when": "Need to prevent member accounts from disabling security services like CloudTrail or GuardDuty",
        "pick": "Service Control Policies (SCPs)"
      }
    ]
  },
  {
    "id": "audit-manager",
    "name": "AWS Audit Manager",
    "category": "Security & Identity",
    "oneLiner": "A service that automates collection of evidence for audits against industry frameworks and standards.",
    "specifics": [
      "Uses prebuilt frameworks (e.g., PCI DSS, HIPAA, SOC 2, CIS) or custom frameworks mapped to specific AWS resource controls.",
      "Continuously and automatically collects evidence (configuration snapshots, compliance check results, user activity) rather than requiring manual screenshotting.",
      "Organizes evidence into assessments, producing an assessment report suitable for handing to an external auditor.",
      "Can operate across an AWS Organizations structure to pull evidence from multiple accounts into one assessment.",
      "Priced per resource assessed per region, not a flat audit fee."
    ],
    "bestFor": [
      "Preparing for a formal compliance audit (SOC 2, PCI DSS, HIPAA) with less manual evidence-gathering effort.",
      "Maintaining continuous, audit-ready evidence rather than scrambling before an audit date.",
      "Mapping AWS resource configurations directly to specific controls in a named compliance framework.",
      "Organizations needing a repeatable, exportable audit trail across multiple accounts."
    ],
    "watchOutFor": [
      "It assembles and organizes evidence for human/external auditors — it does not itself certify compliance or replace an actual audit.",
      "Easy to confuse with Config/Security Hub: Audit Manager's output is an audit-ready report artifact, not real-time compliance monitoring or finding aggregation."
    ],
    "distinguishFrom": [
      {
        "service": "AWS Config",
        "note": "Config continuously evaluates resource compliance in near real time; Audit Manager packages evidence (which can include Config results) into a formal assessment report for auditors."
      }
    ],
    "triggers": [
      {
        "when": "Preparing for a formal compliance audit (SOC 2, PCI DSS, HIPAA) and want less manual evidence gathering",
        "pick": "AWS Audit Manager"
      },
      {
        "when": "Want continuous, audit-ready evidence instead of scrambling right before an audit date",
        "pick": "AWS Audit Manager"
      },
      {
        "when": "Need AWS resource configurations mapped directly to controls in a named compliance framework",
        "pick": "AWS Audit Manager"
      }
    ]
  },
  {
    "id": "organizations",
    "name": "AWS Organizations",
    "category": "Security & Identity",
    "oneLiner": "A service for centrally managing and governing multiple AWS accounts under one organization.",
    "specifics": [
      "Accounts are arranged in a hierarchy of organizational units (OUs), enabling policies to be applied at the root, OU, or account level.",
      "Supports Service Control Policies (SCPs), tag policies, backup policies, and AI services opt-out policies applied centrally.",
      "Consolidated Billing combines usage from all member accounts onto a single payer (management account) bill, and can unlock volume pricing/Reserved Instance and Savings Plan sharing across accounts.",
      "New accounts can be programmatically created within the organization without separate billing setup for each one.",
      "There is no additional charge for AWS Organizations itself — you pay only for the underlying resources used."
    ],
    "bestFor": [
      "Multi-account strategies (e.g., separate accounts per team/environment) with centralized governance and billing.",
      "Sharing Reserved Instance/Savings Plan discounts and combining usage for volume pricing across many accounts.",
      "Applying consistent guardrails (SCPs, tag policies) across large numbers of accounts via OUs.",
      "Foundational prerequisite for Control Tower, which builds a governed landing zone on top of Organizations."
    ],
    "watchOutFor": [
      "The management account has special privileges (SCPs don't apply to it) and should be treated as highly sensitive — avoid running workloads directly in it.",
      "Consolidated Billing shares cost visibility and discounts but does not by itself enforce any security guardrails — that requires SCPs/tag policies on top."
    ],
    "distinguishFrom": [
      {
        "service": "AWS Control Tower",
        "note": "Organizations provides the raw multi-account/OU structure and policy attachment mechanism; Control Tower is a higher-level service that automates setting up a best-practice landing zone on top of Organizations."
      }
    ],
    "triggers": [
      {
        "when": "Multi-account strategy needs centralized governance and consolidated billing",
        "pick": "AWS Organizations"
      },
      {
        "when": "Want to share Reserved Instance or Savings Plan discounts and combine usage across many accounts",
        "pick": "AWS Organizations (consolidated billing)"
      },
      {
        "when": "Need consistent guardrails (SCPs, tag policies) applied across accounts via OUs",
        "pick": "AWS Organizations"
      }
    ]
  },
  {
    "id": "control-tower",
    "name": "AWS Control Tower",
    "category": "Security & Identity",
    "oneLiner": "A managed service that automates setting up a secure, multi-account AWS landing zone based on best practices.",
    "specifics": [
      "Builds on top of AWS Organizations, automatically configuring a management account plus baseline OUs (e.g., Security, Sandbox).",
      "Deploys guardrails — preventive (implemented as SCPs) and detective (implemented as Config rules) — to enforce and monitor compliance across accounts.",
      "Provides an Account Factory for automated, standardized provisioning of new member accounts with baseline configuration pre-applied.",
      "Includes a centralized dashboard showing compliance status of guardrails across the entire organization.",
      "No additional charge for Control Tower itself — you pay for the underlying resources (Config, CloudTrail, etc.) it provisions."
    ],
    "bestFor": [
      "Standing up a new multi-account AWS environment quickly with governance guardrails already in place.",
      "Organizations wanting standardized, repeatable account provisioning instead of manually configuring each new account.",
      "Centrally monitoring guardrail compliance status across many accounts from one dashboard.",
      "Teams that want Organizations' capabilities but without hand-building the landing zone from scratch."
    ],
    "watchOutFor": [
      "It's an opinionated automation layer on Organizations, not a replacement — some advanced/custom OU structures may need direct Organizations configuration alongside it.",
      "Guardrails are implemented under the hood as SCPs and Config rules, so understanding those underlying services still matters for troubleshooting."
    ],
    "distinguishFrom": [
      {
        "service": "AWS Organizations",
        "note": "Control Tower automates and adds guardrails/dashboards on top of the account/OU structure that Organizations itself provides."
      }
    ],
    "triggers": [
      {
        "when": "Standing up a new multi-account AWS environment quickly with governance guardrails already in place",
        "pick": "AWS Control Tower"
      },
      {
        "when": "Want standardized, repeatable account provisioning instead of manually configuring each new account",
        "pick": "AWS Control Tower (Account Factory)"
      },
      {
        "when": "Need a centralized dashboard showing guardrail compliance status across many accounts",
        "pick": "AWS Control Tower"
      }
    ]
  },
  {
    "id": "tag-policies",
    "name": "Tag Policies",
    "category": "Security & Identity",
    "oneLiner": "AWS Organizations policies that enforce consistent, standardized resource tagging across member accounts.",
    "specifics": [
      "Attached at the organization root, OU, or account level, similar to SCPs, and only function within AWS Organizations.",
      "Define allowed tag keys, required capitalization, and allowed values (e.g., enforce CostCenter must be one of a fixed list).",
      "Operate in reporting mode by default, flagging non-compliant resources without blocking the action that created them.",
      "Compliance can be reviewed via the tag policy compliance report across accounts in the organization.",
      "No direct charge for tag policies themselves — governance overhead is organizational, not billed."
    ],
    "bestFor": [
      "Ensuring consistent cost-allocation tags (e.g., CostCenter, Project) across all accounts for accurate billing reports.",
      "Standardizing tag key naming/casing so automation and cost tools can reliably parse tags org-wide.",
      "Auditing which resources fail to meet the organization's tagging standard.",
      "Supporting downstream tools (Cost Explorer, resource groups) that depend on consistent tag structure."
    ],
    "watchOutFor": [
      "Tag policies report non-compliance; they do not by themselves prevent creation of a non-compliant resource or auto-fix existing tags."
    ],
    "distinguishFrom": [
      {
        "service": "Service Control Policies (SCPs)",
        "note": "Tag policies standardize and report on tag key/value compliance; SCPs restrict the maximum allowed IAM actions. A tag-enforcement SCP (denying resource creation without required tags) is a separate, stricter mechanism from a tag policy."
      }
    ],
    "triggers": [
      {
        "when": "Need consistent cost-allocation tags (e.g. CostCenter, Project) across all accounts for accurate billing",
        "pick": "Tag Policies"
      },
      {
        "when": "Want to standardize tag key naming/casing so automation and cost tools parse tags org-wide",
        "pick": "Tag Policies"
      },
      {
        "when": "Need to audit which resources fail to meet the organization's tagging standard",
        "pick": "Tag Policies"
      }
    ]
  },
  {
    "id": "kinesis-data-streams",
    "name": "Amazon Kinesis Data Streams",
    "category": "Analytics & Streaming",
    "oneLiner": "A real-time streaming service where you manage shard capacity to ingest and process high-throughput, ordered event data with custom consumers.",
    "specifics": [
      "Throughput is provisioned per shard; you scale shard count manually (Provisioned mode) or let AWS auto-scale (On-Demand mode)",
      "Ordering is guaranteed only within a shard, based on each record's partition key",
      "Retention is configurable from 24 hours (default) up to 365 days, at added cost",
      "Multiple independent consumer applications (e.g., via KCL) can read the same stream in parallel",
      "Billing is based on shard-hours and PUT payload units (Provisioned) or throughput consumed (On-Demand)"
    ],
    "bestFor": [
      "Custom real-time pipelines needing sub-second processing with multiple independent consumer applications",
      "Ordered, replayable event streams such as clickstream or IoT telemetry with custom processing logic"
    ],
    "watchOutFor": [
      "You are responsible for right-sizing shard capacity (or choosing On-Demand); undersized shards cause write/read throttling"
    ],
    "distinguishFrom": [
      {
        "service": "Amazon Data Firehose",
        "note": "Kinesis Data Streams is for custom, low-latency consumers you build and control. Firehose is fully managed with no shard management, and only delivers near-real-time to a fixed destination — it cannot be read by custom stream-processing applications."
      },
      {
        "service": "Amazon MSK",
        "note": "Kinesis Data Streams uses an AWS-proprietary API and integrates natively with other AWS services. MSK is the choice when a team specifically needs the Apache Kafka protocol and ecosystem (Kafka Connect, Kafka Streams, existing Kafka clients)."
      }
    ],
    "triggers": [
      {
        "when": "Need sub-second custom stream processing with multiple independent consumer applications reading the same data",
        "pick": "Kinesis Data Streams"
      },
      {
        "when": "Need an ordered, replayable event stream (clickstream, IoT telemetry) with custom processing logic",
        "pick": "Kinesis Data Streams"
      },
      {
        "when": "Seeing write/read throttling on a stream",
        "pick": "Kinesis Data Streams (undersized shard capacity - resize shards or switch to On-Demand)"
      }
    ]
  },
  {
    "id": "kinesis-firehose",
    "name": "Amazon Data Firehose",
    "category": "Analytics & Streaming",
    "oneLiner": "A fully managed service that captures streaming data and automatically loads it near-real-time into a destination like S3, Redshift, or OpenSearch.",
    "specifics": [
      "Formerly named Amazon Kinesis Data Firehose; no shards or capacity to manage, it auto-scales to incoming throughput",
      "Buffers records by size or time interval before delivery, so delivery is near-real-time, not sub-second",
      "Can optionally invoke Lambda for transformation and convert formats (e.g., JSON to Parquet) before writing to the destination",
      "Billing is based on the volume of data ingested (per GB), not on shard-hours",
      "Writes only to its configured destination; it cannot be read by custom downstream consumer applications"
    ],
    "bestFor": [
      "Low-ops pipelines that just need streaming data landed into a data lake or warehouse automatically",
      "Converting or compressing streaming data into an analytics-friendly format on the way into S3"
    ],
    "watchOutFor": [
      "Buffering introduces delivery delay of seconds to minutes, so it is not suitable when true sub-second processing is required"
    ],
    "distinguishFrom": [
      {
        "service": "Kinesis Data Streams",
        "note": "Firehose automatically delivers to a fixed destination with no infrastructure to manage. Kinesis Data Streams requires you to manage shard capacity and write custom consumer code for real-time, low-latency processing."
      },
      {
        "service": "Amazon MSK",
        "note": "Firehose is a one-way managed delivery pipe with no broker or consumer-group model. MSK is a durable pub/sub Kafka cluster that client applications connect to and read from directly."
      }
    ],
    "triggers": [
      {
        "when": "Need streaming data landed automatically into S3, Redshift, or OpenSearch with no infrastructure to manage",
        "pick": "Amazon Data Firehose"
      },
      {
        "when": "Need to convert or compress streaming data into an analytics-friendly format (e.g., JSON to Parquet) on the way into S3",
        "pick": "Amazon Data Firehose"
      },
      {
        "when": "Delivery delay of seconds to minutes is acceptable and true sub-second processing isn't required",
        "pick": "Amazon Data Firehose"
      }
    ]
  },
  {
    "id": "msk",
    "name": "Amazon MSK",
    "category": "Analytics & Streaming",
    "oneLiner": "A managed service for running Apache Kafka clusters, giving teams the native Kafka API and ecosystem without operating the brokers themselves.",
    "specifics": [
      "Offers Provisioned mode, where you choose broker instance types and count, and Serverless mode, which auto-scales capacity",
      "Fully compatible with open-source Kafka APIs, so existing Kafka clients, Kafka Connect, and Kafka Streams work largely unchanged",
      "AWS manages broker provisioning, patching, and multi-AZ replication; you still manage topics and partitions",
      "Retention is configured per Kafka norms (time- or size-based), independent of any AWS-wide retention cap",
      "Billing is based on broker instance-hours plus storage (Provisioned) or on throughput consumed (Serverless)"
    ],
    "bestFor": [
      "Migrating existing Kafka workloads to AWS with minimal changes to producers or consumers",
      "Teams standardized on the Kafka ecosystem and tooling who want managed infrastructure instead of self-hosting"
    ],
    "watchOutFor": [
      "Requires more Kafka-specific operational knowledge (partitions, consumer groups) than a fully serverless option like Firehose"
    ],
    "distinguishFrom": [
      {
        "service": "Kinesis Data Streams",
        "note": "MSK is the right pick when the requirement is Kafka protocol/API compatibility itself. Kinesis Data Streams uses an AWS-specific API and is simpler to integrate with native AWS services but does not speak Kafka."
      },
      {
        "service": "Amazon Data Firehose",
        "note": "MSK is a stateful, durable message broker that consumer applications connect to and read from. Firehose has no broker or consumer concept — it only pushes data forward to a fixed destination."
      }
    ],
    "triggers": [
      {
        "when": "Migrating an existing Kafka workload to AWS with minimal changes to producers or consumers",
        "pick": "Amazon MSK"
      },
      {
        "when": "Team needs the native Kafka protocol/ecosystem (Kafka Connect, Kafka Streams, existing Kafka clients)",
        "pick": "Amazon MSK"
      },
      {
        "when": "Solution must manage Kafka-specific concepts like partitions and consumer groups",
        "pick": "Amazon MSK"
      }
    ]
  },
  {
    "id": "managed-flink",
    "name": "Amazon Managed Service for Apache Flink",
    "category": "Analytics & Streaming",
    "oneLiner": "A fully managed service for running Apache Flink applications that process and analyze streaming data in real time using SQL, Java, or Python.",
    "specifics": [
      "Formerly named Amazon Kinesis Data Analytics; now branded around the underlying Apache Flink engine",
      "Typically reads from a source stream such as Kinesis Data Streams or MSK, and writes results to a chosen destination",
      "Supports stateful stream processing: windowed aggregations, joins, and pattern detection via the Flink runtime",
      "Compute auto-scales based on Kinesis Processing Units (KPUs), which combine vCPU and memory",
      "Billing is based on KPU-hours consumed by the running application, not on data volume"
    ],
    "bestFor": [
      "Real-time analytics requiring complex logic like windowed aggregation, joins, or anomaly detection on streaming data",
      "Running Apache Flink applications without provisioning or managing the underlying cluster infrastructure"
    ],
    "watchOutFor": [
      "Adds a processing and cost layer on top of the underlying stream source; unnecessary for simple pass-through delivery"
    ],
    "distinguishFrom": [
      {
        "service": "Kinesis Data Streams",
        "note": "Managed Flink is the compute/analytics layer that reads and processes records from a stream. Kinesis Data Streams itself only ingests and stores data — it has no query or transformation engine built in."
      },
      {
        "service": "Amazon Data Firehose",
        "note": "Firehose can invoke a simple Lambda function for light transformation, but has no stateful query engine. Managed Flink is for genuine streaming analytics logic like windowed joins and aggregations."
      }
    ],
    "triggers": [
      {
        "when": "Need windowed aggregations, joins, or anomaly detection on streaming data in real time",
        "pick": "Managed Service for Apache Flink"
      },
      {
        "when": "Want to run Apache Flink applications without provisioning or managing cluster infrastructure",
        "pick": "Managed Service for Apache Flink"
      },
      {
        "when": "Question references the former name 'Kinesis Data Analytics'",
        "pick": "Managed Service for Apache Flink"
      }
    ]
  },
  {
    "id": "athena",
    "name": "Amazon Athena",
    "category": "Analytics & Streaming",
    "oneLiner": "A serverless, interactive query service that lets you run SQL directly against data stored in S3 without managing infrastructure.",
    "specifics": [
      "No clusters to provision, patch, or manage; queries run on-demand directly against objects in S3",
      "Relies on a schema-on-read table definition, typically from the Glue Data Catalog, mapped over S3 data",
      "On-demand pricing is per query based on the amount of data scanned (billed per TB scanned)",
      "A provisioned-capacity pricing option exists for workloads needing predictable performance and cost",
      "Columnar formats (Parquet/ORC), compression, and partitioning reduce both scan cost and query time"
    ],
    "bestFor": [
      "Ad hoc, occasional SQL analysis directly on data already sitting in S3, without loading it elsewhere",
      "Querying logs or data lake content without standing up or maintaining a database or warehouse"
    ],
    "watchOutFor": [
      "Cost scales with data scanned, so unpartitioned or uncompressed data can make queries unexpectedly expensive"
    ],
    "distinguishFrom": [
      {
        "service": "Amazon Redshift",
        "note": "Athena needs no always-on cluster and charges per query scanned, making it ideal for sporadic queries. Redshift requires provisioned or serverless compute billed for an active warehouse workload."
      },
      {
        "service": "Amazon EMR",
        "note": "Athena is a simple serverless SQL interface for ad hoc queries over S3. EMR is a managed cluster platform for custom big-data processing frameworks like Spark or Hadoop, well beyond plain SQL."
      },
      {
        "service": "AWS Glue",
        "note": "Athena is the query engine that reads data; Glue crawlers and jobs discover schema and transform or prepare the underlying data that Athena then queries."
      }
    ],
    "triggers": [
      {
        "when": "Need ad hoc SQL queries directly against data already sitting in S3 without loading it elsewhere",
        "pick": "Amazon Athena"
      },
      {
        "when": "Occasional, sporadic queries where paying per query scanned beats running an always-on cluster",
        "pick": "Amazon Athena"
      },
      {
        "when": "Unpartitioned or uncompressed S3 data is making queries unexpectedly expensive",
        "pick": "Amazon Athena (use Parquet/ORC, compression, and partitioning)"
      }
    ]
  },
  {
    "id": "glue",
    "name": "AWS Glue",
    "category": "Analytics & Streaming",
    "oneLiner": "A serverless ETL service that discovers, catalogs, and transforms data between formats and storage locations.",
    "specifics": [
      "Crawlers scan data sources like S3 and infer schema, populating the Glue Data Catalog, a central metadata repository",
      "Glue jobs (Spark or Python shell) run serverless ETL transformations, such as converting CSV to Parquet",
      "Glue Studio provides a visual, no-code interface for building and orchestrating ETL jobs",
      "The Data Catalog acts as a shared metastore used by Athena, Redshift Spectrum, EMR, and other services",
      "Billing is based on Data Processing Units (DPU) consumed per job run, plus crawler run time"
    ],
    "bestFor": [
      "Automating schema discovery and building a searchable catalog over data lake content",
      "Serverless batch ETL jobs that clean, reformat, or convert data between storage locations"
    ],
    "watchOutFor": [
      "Job startup incurs cold-start/provisioning latency, making Glue unsuited to sub-second or streaming transformations"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Lake Formation",
        "note": "Glue builds and stores the schema catalog. Lake Formation sits on top of that same catalog to add centralized, fine-grained row- and column-level access permissions across consuming services."
      },
      {
        "service": "Amazon EMR",
        "note": "Glue is serverless and streamlined for defined ETL tasks with minimal configuration. EMR gives full control over cluster sizing and supports a broader range of big-data frameworks for custom processing."
      }
    ],
    "triggers": [
      {
        "when": "Need to discover schema and build a searchable catalog over data lake content automatically",
        "pick": "AWS Glue"
      },
      {
        "when": "Need serverless batch ETL to clean, reformat, or convert data (e.g., CSV to Parquet) between storage locations",
        "pick": "AWS Glue"
      },
      {
        "when": "Multiple services (Athena, Redshift Spectrum, EMR) need a shared metastore over the same data",
        "pick": "AWS Glue (Data Catalog)"
      }
    ]
  },
  {
    "id": "lake-formation",
    "name": "AWS Lake Formation",
    "category": "Analytics & Streaming",
    "oneLiner": "A service that centralizes setup of a secure data lake and adds fine-grained access permissions on top of the Glue Data Catalog.",
    "specifics": [
      "Builds on the existing AWS Glue Data Catalog rather than maintaining a separate metadata store",
      "Enables row-level, column-level, and tag-based (cell-level) permissions on data lake tables",
      "Permissions are enforced consistently across consuming services such as Athena, Redshift Spectrum, and EMR",
      "Provides a single console workflow to register data sources, apply governance, and grant access",
      "No separate service charge beyond the underlying storage and compute used by connected services"
    ],
    "bestFor": [
      "Enforcing centralized, fine-grained access control across teams and services querying the same data lake",
      "Simplifying governance when multiple services (Athena, Redshift Spectrum, EMR) must enforce identical permissions"
    ],
    "watchOutFor": [
      "Does not replace the Glue Catalog — it layers permissions on top, so Glue cataloging is still a prerequisite"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Glue",
        "note": "Glue crawls and builds the metadata catalog itself. Lake Formation adds a governance and permissions layer on top of that same catalog rather than duplicating it."
      },
      {
        "service": "IAM",
        "note": "IAM controls access to AWS resources broadly at the service/API level. Lake Formation adds data-level row and column permission granularity for data lake tables that IAM alone cannot express."
      }
    ],
    "triggers": [
      {
        "when": "Need centralized, fine-grained row-level, column-level, or tag-based permissions on data lake tables",
        "pick": "AWS Lake Formation"
      },
      {
        "when": "Multiple services (Athena, Redshift Spectrum, EMR) must enforce identical governance/permissions on the same data",
        "pick": "AWS Lake Formation"
      }
    ]
  },
  {
    "id": "quicksight",
    "name": "Amazon QuickSight",
    "category": "Analytics & Streaming",
    "oneLiner": "A serverless business intelligence service for building interactive dashboards and visualizations from various data sources.",
    "specifics": [
      "Serverless — automatically scales to the number of users and queries without any infrastructure to manage",
      "SPICE is its in-memory caching engine that accelerates dashboards and reduces load on source systems",
      "Connects to sources including S3, Athena, Redshift, RDS, and various on-premises databases",
      "Pricing is per-user (Author or Reader) subscription-based, rather than per query or per dataset",
      "Includes built-in ML-powered features like anomaly detection and forecasting within dashboards"
    ],
    "bestFor": [
      "Building shareable, interactive dashboards and visual reports for business users",
      "Embedding analytics and dashboards directly into external or internal applications"
    ],
    "watchOutFor": [
      "It is a visualization/BI layer only — underlying data still needs to be prepared and queryable elsewhere first"
    ],
    "distinguishFrom": [
      {
        "service": "Amazon Athena",
        "note": "QuickSight is the visualization and dashboarding layer end users interact with. Athena is a query engine that can serve as one of the data sources QuickSight pulls results from."
      }
    ],
    "triggers": [
      {
        "when": "need to build shareable, interactive dashboards and visual reports for business users",
        "pick": "Amazon QuickSight"
      },
      {
        "when": "need to embed analytics or dashboards directly into an external or internal application",
        "pick": "Amazon QuickSight"
      }
    ]
  },
  {
    "id": "emr",
    "name": "Amazon EMR",
    "category": "Analytics & Streaming",
    "oneLiner": "A managed big-data platform for running open-source frameworks like Apache Spark and Hadoop on clusters you size and control.",
    "specifics": [
      "You choose instance types and cluster size, and can mix On-Demand, Spot, and Reserved instances to control cost",
      "Supports Spark, Hadoop, Hive, Presto, HBase, and other big-data frameworks on a shared platform",
      "Clusters can run persistently or transiently — spun up for a batch job, then torn down automatically",
      "Deployment options include EC2-based clusters, EMR on EKS, and EMR Serverless (no cluster management)",
      "Billing combines the underlying EC2/EKS instance cost with an additional EMR per-instance-hour fee"
    ],
    "bestFor": [
      "Large-scale custom data processing or transformation jobs using Spark, Hadoop, or similar frameworks",
      "Workloads needing full control over cluster configuration, framework versions, or custom libraries"
    ],
    "watchOutFor": [
      "Requires more cluster and configuration management than serverless alternatives like Athena or Glue, unless using EMR Serverless"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Glue",
        "note": "EMR gives full control over cluster sizing and supports a wider range of big-data frameworks. Glue is serverless and streamlined specifically for defined ETL jobs with less configuration overhead."
      },
      {
        "service": "Amazon Athena",
        "note": "EMR runs custom, large-scale processing code such as Spark or Hadoop jobs on managed clusters. Athena is limited to SQL queries directly over S3 with no cluster to provision."
      }
    ],
    "triggers": [
      {
        "when": "Large-scale custom processing job using Spark, Hadoop, Hive, Presto, or HBase needing full cluster control",
        "pick": "Amazon EMR"
      },
      {
        "when": "Need to mix On-Demand, Spot, and Reserved instances to control big-data cluster cost",
        "pick": "Amazon EMR"
      },
      {
        "when": "Need a transient cluster spun up for a batch job then torn down automatically",
        "pick": "Amazon EMR"
      }
    ]
  },
  {
    "id": "dms",
    "name": "AWS Database Migration Service (DMS)",
    "category": "Migration & Transfer",
    "oneLiner": "A managed service that migrates the actual data in a database to AWS with minimal downtime.",
    "specifics": [
      "Supports homogeneous (same engine) and heterogeneous (different engine) database migrations",
      "Runs on managed replication instances; billed by instance hours plus storage used",
      "Performs an initial full load, then optional continuous replication (CDC) to keep source and target in sync",
      "CDC enables a low-downtime cutover: switch traffic once source and target are fully caught up",
      "Migrates data only, not schema or stored procedures/code"
    ],
    "bestFor": [
      "Migrating a production database to RDS/Aurora with near-zero downtime via CDC",
      "Continuous replication for ongoing cross-region or cross-account database sync",
      "Consolidating multiple source databases into a single AWS target"
    ],
    "watchOutFor": [
      "Does not convert schema or application code — heterogeneous migrations need SCT to convert schema first",
      "Large object (LOB) columns can slow full-load performance if not tuned"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Schema Conversion Tool (SCT)",
        "note": "DMS moves the data itself; SCT converts schema and code beforehand for heterogeneous engine changes. They are used together, not interchangeably, in heterogeneous migrations."
      },
      {
        "service": "AWS Application Migration Service (MGN)",
        "note": "DMS migrates database contents only; MGN lifts and shifts entire servers (OS, apps, everything) into EC2."
      }
    ],
    "triggers": [
      {
        "when": "Migrating a live production database to RDS/Aurora with near-zero downtime",
        "pick": "DMS (with CDC)"
      },
      {
        "when": "Need ongoing cross-region or cross-account database replication/sync",
        "pick": "DMS"
      },
      {
        "when": "Consolidating multiple source databases into a single AWS target",
        "pick": "DMS"
      }
    ]
  },
  {
    "id": "sct",
    "name": "AWS Schema Conversion Tool (SCT)",
    "category": "Migration & Transfer",
    "oneLiner": "A tool that converts database schema and code, such as stored procedures, from one database engine to another.",
    "specifics": [
      "Used for heterogeneous migrations where source and target engines differ, e.g. Oracle to Aurora PostgreSQL",
      "Not needed for homogeneous migrations between the same engine type",
      "Converts schema objects and auto-converts or flags application code like stored procedures and functions",
      "Produces a migration assessment report estimating manual conversion effort before migration begins",
      "Free desktop application, typically run before DMS in a heterogeneous migration workflow"
    ],
    "bestFor": [
      "Migrating from a commercial engine to a different or open-source engine",
      "Assessing migration complexity and effort before committing to a heterogeneous migration"
    ],
    "watchOutFor": [
      "Does not automatically convert 100% of complex procedural code — some objects require manual rework"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Database Migration Service (DMS)",
        "note": "SCT converts schema/code before migration; DMS then migrates the actual data. SCT never moves data itself."
      }
    ],
    "triggers": [
      {
        "when": "Migrating between different database engines, e.g. Oracle to Aurora PostgreSQL",
        "pick": "SCT"
      },
      {
        "when": "Need to assess migration complexity/effort before a heterogeneous migration",
        "pick": "SCT (migration assessment report)"
      }
    ]
  },
  {
    "id": "mgn",
    "name": "AWS Application Migration Service (MGN)",
    "category": "Migration & Transfer",
    "oneLiner": "AWS's lift-and-shift service that migrates entire physical, virtual, or cloud servers into AWS as EC2 instances.",
    "specifics": [
      "Agent-based, continuous block-level replication from source servers to a lightweight staging area in AWS",
      "Sources can be on-prem physical servers, VMs, or instances running in other clouds",
      "Cutover launches fully provisioned, ready-to-use EC2 instances from replicated data, typically minutes of downtime",
      "AWS's recommended service for rehost migrations; successor to CloudEndure Migration",
      "Billed per source server replicated, on a time-based rate"
    ],
    "bestFor": [
      "Rehosting large fleets of servers to EC2 without re-architecting applications",
      "Fast migration from on-prem or another cloud when app changes aren't wanted upfront"
    ],
    "watchOutFor": [
      "Migrates whole servers, not just database contents — not the tool for a database-only migration"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Elastic Disaster Recovery (DRS)",
        "note": "MGN performs a one-time migration cutover; DRS keeps the same style of replication running continuously for ongoing DR readiness, launching instances only during failover."
      }
    ],
    "triggers": [
      {
        "when": "Lift-and-shift entire physical, virtual, or other-cloud servers into EC2",
        "pick": "MGN"
      },
      {
        "when": "Rehosting a large fleet of on-prem servers without re-architecting apps",
        "pick": "MGN"
      },
      {
        "when": "Need a one-time migration cutover with only minutes of downtime",
        "pick": "MGN"
      }
    ]
  },
  {
    "id": "drs",
    "name": "AWS Elastic Disaster Recovery",
    "category": "Migration & Transfer",
    "oneLiner": "A disaster recovery service that continuously replicates on-prem or cloud servers into AWS so they can be launched quickly on failover.",
    "specifics": [
      "Uses the same underlying continuous block-level replication technology as MGN",
      "Replicates into a low-cost staging area (minimal compute/storage), not full-sized standby instances",
      "Launches full-sized recovery instances only when a failover or drill is triggered, keeping standby cost low",
      "Supports multiple point-in-time recovery points for recovering to a specific moment"
    ],
    "bestFor": [
      "Ongoing disaster recovery protection for on-prem or other-cloud servers needing low RPO/RTO",
      "Regularly testing failover readiness without paying for full-sized standby infrastructure"
    ],
    "watchOutFor": [
      "Built for continuous DR readiness, not a one-time migration — use MGN when the goal is a single cutover"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Application Migration Service (MGN)",
        "note": "DRS keeps replication running indefinitely for disaster recovery; MGN is purpose-built for a one-time migration cutover, even though both share the same replication engine."
      }
    ],
    "triggers": [
      {
        "when": "Need ongoing disaster recovery for on-prem or other-cloud servers with low RPO/RTO",
        "pick": "AWS Elastic Disaster Recovery (DRS)"
      },
      {
        "when": "Want to regularly test DR failover readiness without paying for full-sized standby instances",
        "pick": "DRS"
      },
      {
        "when": "Need to recover to a specific point in time after a failover",
        "pick": "DRS"
      }
    ]
  },
  {
    "id": "cloudwatch",
    "name": "Amazon CloudWatch",
    "category": "Management, Monitoring & Cost",
    "oneLiner": "AWS's native monitoring service for collecting metrics, logs, and alarms across AWS resources and applications.",
    "specifics": [
      "Metrics: time-series data per resource/namespace, at standard (5-min) or detailed (1-min) granularity",
      "Alarms: watch a metric or math expression and trigger actions (SNS, Auto Scaling) when thresholds are breached",
      "Logs: centralized log storage from agents, Lambda, ECS, etc., with per-log-group retention settings",
      "Logs Insights: a query language for interactively searching and analyzing log data",
      "CloudWatch Agent: installed on instances to collect OS-level metrics like memory and disk, and custom logs"
    ],
    "bestFor": [
      "Setting automated alarms/notifications on resource health or performance thresholds",
      "Centralizing and querying application or infrastructure logs",
      "Driving Auto Scaling actions from standard or custom metrics"
    ],
    "watchOutFor": [
      "Default EC2 metrics don't include memory or disk usage — the CloudWatch Agent is required for those"
    ],
    "distinguishFrom": [
      {
        "service": "AWS X-Ray / AWS CloudTrail",
        "note": "See the CloudWatch vs CloudTrail vs X-Ray comparison for the full tradeoff.",
        "comparisonId": "cmp-observability"
      }
    ],
    "triggers": [
      {
        "when": "EC2 memory or disk usage metrics missing from monitoring",
        "pick": "CloudWatch (with CloudWatch Agent)"
      },
      {
        "when": "need an alarm to trigger Auto Scaling or SNS when a threshold is breached",
        "pick": "CloudWatch Alarms"
      },
      {
        "when": "need to interactively search/query centralized application logs",
        "pick": "CloudWatch Logs Insights"
      }
    ]
  },
  {
    "id": "x-ray",
    "name": "AWS X-Ray",
    "category": "Management, Monitoring & Cost",
    "oneLiner": "A distributed tracing service that helps analyze and debug performance issues across microservices and serverless applications.",
    "specifics": [
      "Traces requests as they travel across multiple services, producing a visual service map",
      "Requires instrumentation via the X-Ray SDK, or built-in active tracing toggles (e.g. Lambda, API Gateway)",
      "Highlights latency bottlenecks, errors, and faults at each hop in a distributed call chain",
      "Sampling rules control what fraction of requests are traced to manage volume and cost"
    ],
    "bestFor": [
      "Debugging latency or error sources in a microservices or serverless architecture",
      "Visualizing end-to-end request flow across distributed components"
    ],
    "watchOutFor": [
      "Requires code-level instrumentation, unlike CloudWatch's more passive metric/log collection"
    ],
    "distinguishFrom": [
      {
        "service": "Amazon CloudWatch / AWS CloudTrail",
        "note": "See the CloudWatch vs CloudTrail vs X-Ray comparison for the full tradeoff.",
        "comparisonId": "cmp-observability"
      }
    ],
    "triggers": [
      {
        "when": "debugging latency or error source across a microservices/serverless call chain",
        "pick": "X-Ray"
      },
      {
        "when": "need a visual end-to-end service map of a distributed request",
        "pick": "X-Ray"
      }
    ]
  },
  {
    "id": "systems-manager",
    "name": "AWS Systems Manager",
    "category": "Management, Monitoring & Cost",
    "oneLiner": "A management suite for operational tasks across EC2 and on-prem instances, including patching, automation, and secure remote access.",
    "specifics": [
      "Session Manager: browser- or CLI-based shell access to instances without opening inbound ports or managing SSH keys",
      "Automation: runs predefined or custom runbooks (documents) to perform tasks like patching or AMI creation",
      "Requires the SSM Agent running on managed instances, and an IAM role attached granting SSM permissions",
      "Part of the same suite as Parameter Store, used for configuration and secrets storage"
    ],
    "bestFor": [
      "Eliminating bastion hosts and open SSH/RDP ports by using Session Manager for instance access",
      "Automating routine operational tasks (patch management, configuration) at scale across a fleet"
    ],
    "watchOutFor": [
      "Requires the SSM Agent and an attached IAM role — it won't manage an instance without both"
    ],
    "triggers": [
      {
        "when": "need shell access to EC2 without opening inbound SSH/RDP ports or managing keys",
        "pick": "Systems Manager Session Manager"
      },
      {
        "when": "automate patching or configuration tasks at scale across a fleet",
        "pick": "Systems Manager Automation"
      }
    ]
  },
  {
    "id": "trusted-advisor",
    "name": "AWS Trusted Advisor",
    "category": "Management, Monitoring & Cost",
    "oneLiner": "An automated advisor that inspects your account and gives best-practice recommendations across cost, performance, security, and limits.",
    "specifics": [
      "Checks span six categories: cost optimization, performance, security, fault tolerance (resilience), service limits, and operational excellence",
      "Full check set requires Business or Enterprise Support; Basic/Developer support gets only a limited core set",
      "Surfaces recommendations only — it does not automatically remediate or fix anything itself",
      "Can refresh checks on demand and integrates with EventBridge for automated notifications"
    ],
    "bestFor": [
      "Periodic account health reviews to catch idle resources, open security groups, or unused reservations",
      "Flagging when usage is approaching a service limit before it causes failures"
    ],
    "watchOutFor": [
      "Does not remediate issues or request quota increases — it only flags them, you must act separately"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Service Quotas",
        "note": "Trusted Advisor only flags that a limit is being approached; it cannot request an increase. \"EC2 quota exceeded\" errors are always resolved in Service Quotas, not Trusted Advisor."
      }
    ],
    "triggers": [
      {
        "when": "want an automated best-practice review across cost, security, and fault tolerance",
        "pick": "Trusted Advisor"
      },
      {
        "when": "flagged as approaching a service limit but can't request the increase itself",
        "pick": "Trusted Advisor"
      }
    ]
  },
  {
    "id": "aws-health",
    "name": "AWS Health",
    "category": "Management, Monitoring & Cost",
    "oneLiner": "A service that provides visibility into AWS service health events and how they specifically affect your account's resources.",
    "specifics": [
      "Service Health Dashboard: public, general AWS-wide status of all services",
      "Personal Health Dashboard: account-specific view of events actually affecting your resources",
      "Notifies of scheduled maintenance, service issues, and resource-specific events like EC2 instance retirement",
      "Can integrate with EventBridge to automate responses to health events",
      "Organizational View aggregates health events across an AWS Organization with Business/Enterprise support"
    ],
    "bestFor": [
      "Getting proactive, account-specific alerts about resource-impacting events",
      "Automating operational responses to AWS-side events via EventBridge"
    ],
    "watchOutFor": [
      "Don't confuse the account-specific Personal Health Dashboard with the general public Service Health Dashboard"
    ],
    "triggers": [
      {
        "when": "need account-specific notice of EC2 instance retirement or scheduled maintenance",
        "pick": "AWS Health (Personal Health Dashboard)"
      },
      {
        "when": "aggregate health events across an entire AWS Organization",
        "pick": "AWS Health Organizational View"
      }
    ]
  },
  {
    "id": "service-catalog",
    "name": "AWS Service Catalog",
    "category": "Management, Monitoring & Cost",
    "oneLiner": "A service for creating and managing curated catalogs of approved AWS resources that users can self-service deploy.",
    "specifics": [
      "Products are typically defined as CloudFormation templates, organized into portfolios",
      "Admins control which IAM users, roles, or groups can access each portfolio",
      "Supports constraints that limit allowed configurations, e.g. restricting which instance types can be launched",
      "Supports versioning of products so updates roll out in a controlled way"
    ],
    "bestFor": [
      "Letting developers self-service deploy pre-approved architectures without direct CloudFormation/console access",
      "Enforcing organizational standards (allowed configs, tagging) while still enabling self-service"
    ],
    "watchOutFor": [
      "Requires products to be pre-built as CloudFormation templates — not for arbitrary ad-hoc provisioning"
    ],
    "triggers": [
      {
        "when": "let developers self-service deploy pre-approved CloudFormation architectures",
        "pick": "Service Catalog"
      },
      {
        "when": "enforce standard, constrained configurations while still enabling self-service provisioning",
        "pick": "Service Catalog"
      }
    ]
  },
  {
    "id": "service-quotas",
    "name": "AWS Service Quotas",
    "category": "Management, Monitoring & Cost",
    "oneLiner": "The central service for viewing current AWS account service limits and requesting increases to them.",
    "specifics": [
      "Shows current quotas (limits) across AWS services for the account and region",
      "Lets you submit quota increase requests directly, some auto-approved and others requiring AWS review",
      "Can set CloudWatch alarms on quota utilization to get warned before a limit is hit",
      "Most quotas are adjustable; a small set of hard limits cannot be increased"
    ],
    "bestFor": [
      "Requesting an increase after hitting a \"limit exceeded\" error, e.g. EC2 vCPU limits",
      "Proactively monitoring usage against quotas via CloudWatch alarm integration"
    ],
    "watchOutFor": [
      "Often confused with Trusted Advisor, which only flags approaching limits but cannot request increases"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Trusted Advisor",
        "note": "Trusted Advisor flags that a limit is being approached as a recommendation; Service Quotas is where the increase is actually viewed and requested."
      }
    ],
    "triggers": [
      {
        "when": "EC2 vCPU limit exceeded error and you need to request an increase",
        "pick": "Service Quotas"
      },
      {
        "when": "set a CloudWatch alarm to warn before a service limit is hit",
        "pick": "Service Quotas"
      }
    ]
  },
  {
    "id": "compute-optimizer",
    "name": "AWS Compute Optimizer",
    "category": "Management, Monitoring & Cost",
    "oneLiner": "A recommendation service that analyzes resource utilization and suggests optimal instance types or sizes for cost and performance.",
    "specifics": [
      "Analyzes historical CloudWatch utilization metrics (CPU, memory if agent installed, network)",
      "Covers EC2 instances, Auto Scaling groups, EBS volumes, Lambda functions, ECS on Fargate, and RDS/Aurora instance and storage rightsizing",
      "Provides recommendations such as downsizing or changing instance family, with projected utilization impact",
      "Requires opt-in enrollment at the account or organization level before generating recommendations"
    ],
    "bestFor": [
      "Right-sizing over-provisioned EC2 instances or Lambda memory settings to cut cost",
      "Getting data-driven instance family recommendations instead of guessing"
    ],
    "watchOutFor": [
      "Needs sufficient historical utilization data (typically a couple of weeks) before recommendations are reliable"
    ],
    "triggers": [
      {
        "when": "need a data-driven recommendation for right-sizing over-provisioned EC2 instances",
        "pick": "Compute Optimizer"
      },
      {
        "when": "right-size Lambda memory or EBS volumes based on historical utilization",
        "pick": "Compute Optimizer"
      }
    ]
  },
  {
    "id": "cost-explorer",
    "name": "AWS Cost Explorer",
    "category": "Management, Monitoring & Cost",
    "oneLiner": "A visualization and analysis tool for exploring historical AWS spend and forecasting future costs.",
    "specifics": [
      "Filters and groups spend by service, linked account, tag, region, and other dimensions",
      "Provides spend forecasting based on historical usage trends",
      "Data viewable at daily or monthly granularity over a historical lookback window",
      "Read-only analysis and visualization — it does not itself send alerts or enforce thresholds"
    ],
    "bestFor": [
      "Investigating what's driving a cost spike, by service, tag, or account",
      "Forecasting upcoming spend based on historical trends"
    ],
    "watchOutFor": [
      "Doesn't proactively alert you — threshold-based notifications require AWS Budgets instead"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Budgets",
        "note": "Cost Explorer is for visualizing and analyzing spend after the fact; Budgets proactively alerts you when spend or forecasted spend crosses a threshold you set."
      },
      {
        "service": "AWS Cost and Usage Report (CUR)",
        "note": "Cost Explorer gives aggregated visual analysis; CUR provides the raw, line-item-level billing data for custom analysis."
      }
    ],
    "triggers": [
      {
        "when": "investigate what's driving a cost spike by service, tag, or account",
        "pick": "Cost Explorer"
      },
      {
        "when": "forecast upcoming AWS spend from historical usage trends",
        "pick": "Cost Explorer"
      }
    ]
  },
  {
    "id": "budgets",
    "name": "AWS Budgets",
    "category": "Management, Monitoring & Cost",
    "oneLiner": "A service that lets you set cost or usage thresholds and get alerted when actual or forecasted spend exceeds them.",
    "specifics": [
      "Supports cost budgets, usage budgets, and RI/Savings Plans utilization or coverage budgets",
      "Alerts can trigger on actual spend or on forecasted spend crossing a defined threshold",
      "Notifications go via SNS/email, and budget actions can automate a response, e.g. applying a restrictive IAM policy",
      "Budgets can be scoped by tag, service, or linked account"
    ],
    "bestFor": [
      "Getting proactively alerted before a spend overage happens, using forecasted thresholds",
      "Enforcing per-team or per-project spend guardrails via tag-scoped budgets"
    ],
    "watchOutFor": [
      "Alerts by default — automatically stopping spend requires separately configuring budget actions"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Cost Explorer",
        "note": "Budgets is proactive alerting against a threshold; Cost Explorer is for visualizing and analyzing spend, not for alerting."
      }
    ],
    "triggers": [
      {
        "when": "get alerted before actual or forecasted spend crosses a set threshold",
        "pick": "AWS Budgets"
      },
      {
        "when": "automatically apply a restrictive IAM policy when spend exceeds a limit",
        "pick": "AWS Budgets (budget actions)"
      }
    ]
  },
  {
    "id": "cur",
    "name": "AWS Cost and Usage Report (CUR)",
    "category": "Management, Monitoring & Cost",
    "oneLiner": "The most granular, line-item-level export of AWS billing and usage data, delivered to an S3 bucket.",
    "specifics": [
      "Provides the most detailed billing data available, down to the individual line item and hour",
      "Delivered as files to an S3 bucket on a recurring schedule for downstream processing",
      "Commonly queried with Athena or visualized in QuickSight for custom cost analysis",
      "Can include resource IDs and cost allocation tags for granular attribution"
    ],
    "bestFor": [
      "Building custom cost dashboards or chargeback models beyond what Cost Explorer offers",
      "Detailed SQL-based billing audits for finance or analytics teams"
    ],
    "watchOutFor": [
      "Requires building a pipeline (S3 plus Athena/QuickSight) — it isn't a ready-made UI dashboard"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Cost Explorer",
        "note": "CUR is raw line-item data for custom querying; Cost Explorer is the pre-built visualization layer on top of aggregated spend."
      }
    ],
    "triggers": [
      {
        "when": "need the most granular line-item billing data for SQL-based audits",
        "pick": "Cost and Usage Report (CUR)"
      },
      {
        "when": "build a custom cost dashboard with Athena/QuickSight beyond Cost Explorer",
        "pick": "Cost and Usage Report (CUR)"
      }
    ]
  },
  {
    "id": "cost-allocation-tags",
    "name": "Cost Allocation Tags",
    "category": "Management, Monitoring & Cost",
    "oneLiner": "The tagging mechanism that enables AWS costs to be broken down and attributed by tag in billing tools.",
    "specifics": [
      "Two types: AWS-generated tags (e.g. createdBy) and user-defined tags that must be activated in the Billing console",
      "Tags must be explicitly activated before they appear in cost allocation reports and tools",
      "Once activated, enables filtering and grouping by tag in Cost Explorer, Budgets, and CUR",
      "Costs incurred before a tag is activated are not retroactively attributed to that tag"
    ],
    "bestFor": [
      "Enabling chargeback or showback reporting per team, project, or environment",
      "Any scenario requiring tag-based cost breakdowns in Cost Explorer or CUR"
    ],
    "watchOutFor": [
      "Applying a tag to a resource isn't enough — the tag must also be activated for cost allocation"
    ],
    "distinguishFrom": [
      {
        "service": "AWS Cost and Usage Report (CUR) / Cost Explorer",
        "note": "Cost allocation tags are the prerequisite tagging mechanism; CUR and Cost Explorer are where the tag-based breakdown is actually viewed and analyzed."
      }
    ],
    "triggers": [
      {
        "when": "need to break down and attribute costs per team or project by tag",
        "pick": "Cost Allocation Tags"
      },
      {
        "when": "tag applied to a resource but not appearing in cost reports",
        "pick": "Cost Allocation Tags (must be activated in Billing console)"
      }
    ]
  },
  {
    "id": "savings-plans",
    "name": "AWS Savings Plans",
    "category": "Management, Monitoring & Cost",
    "oneLiner": "A flexible pricing model offering discounted rates in exchange for a committed hourly spend on compute usage over 1 or 3 years.",
    "specifics": [
      "Compute Savings Plans: most flexible, applies across EC2 (any family/region/OS), Fargate, and Lambda",
      "EC2 Instance Savings Plans: locked to a specific instance family and region, in exchange for a deeper discount",
      "Commitment is a dollar-per-hour spend amount, not a specific instance; usage above it is billed at on-demand rates",
      "1-year or 3-year terms, with all-upfront, partial-upfront, or no-upfront payment options",
      "Discount applies automatically to matching usage — no capacity reservation is involved"
    ],
    "bestFor": [
      "Committing to steady baseline compute spend across EC2, Fargate, and Lambda with maximum flexibility",
      "Reducing compute costs when workloads may shift instance family or region over the commitment term"
    ],
    "watchOutFor": [
      "Unlike an EC2 Reserved Instance, it does not reserve capacity — it's a billing discount only"
    ],
    "distinguishFrom": [
      {
        "service": "EC2 Reserved Instances / EC2 purchasing options",
        "note": "Savings Plans is a broader spend-commitment model covering EC2, Fargate, and Lambda together; EC2-specific purchasing options (On-Demand, RIs, Spot) are narrower and covered separately."
      }
    ],
    "triggers": [
      {
        "when": "commit to steady compute spend flexibly across EC2, Fargate, and Lambda",
        "pick": "Savings Plans (Compute Savings Plans)"
      },
      {
        "when": "want a spend-based discount without reserving specific capacity",
        "pick": "Savings Plans"
      }
    ]
  }
];
