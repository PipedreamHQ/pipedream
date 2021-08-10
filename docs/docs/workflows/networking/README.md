# Network / IP range

By default, any network request (e.g. an HTTP request or a connection to a database) you make from Pipedream will originate from the `us-east-1` region of AWS. [AWS publishes the IP address range](https://docs.aws.amazon.com/general/latest/gr/aws-ip-ranges.html) for all regions, but Pipedream shares this range with other services using AWS.

If you use a service that requires you whitelist a range of IP addresses, you have two options.

## HTTP requests

If you need to send HTTP requests to a service from a fixed range of IP addresses, [see these docs](/workflows/steps/code/nodejs/http-requests/#ip-addresses-for-http-requests-made-from-pipedream-workflows).

## Non-HTTP traffic (databases, etc.)

If you need to connect to a service from a fixed range of IP addresses, you can setup a [bastion server](https://medium.com/codex/how-to-setup-bastion-server-with-aws-ec2-b1590d2ff815). A bastion server only runs an SSH service (like [OpenSSH](https://www.openssh.com/)) that listens for incoming SSH connections. You can connect to the bastion host from any IP address, but when you configure the firewall for your service (like your database), you open it up only to the IP address of your bastion server.

Then, in your Pipedream workflow, you can [tunnel the connection](https://linuxize.com/post/how-to-setup-ssh-tunneling/#:~:text=SSH%20tunneling%20or%20SSH%20port,services%20ports%20can%20be%20relayed.&text=%2D%20Forwards%20a%20connection%20from%20the,Remote%20Port%20Forwarding.) to your service through the bastion host.

Here are two example workflows that show you how to connect to services through a bastion server:

- [Run a MySQL query through an SSH tunnel](https://frontend-canary.pipedream.com/@dylburger/run-a-query-on-mysql-via-ssh-tunnel-p_rvCxrNB/edit)
- [Run a PostgreSQL query through an SSH tunnel](https://frontend-canary.pipedream.com/@dylburger/run-a-query-on-postgres-via-ssh-tunnel-p_13CvRz/edit)

## Feature request for Pipedream restricting its IP range

Pipedream plans to restrict the range of IP addresses for workflows in the future. Please [upvote this GitHub issue](https://github.com/PipedreamHQ/pipedream/issues/178) to follow the status of that work.