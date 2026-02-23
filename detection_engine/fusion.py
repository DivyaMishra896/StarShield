def fuse_risk(graph_scores, behavior_scores):
    final_scores = {}

    for user in graph_scores:
        g = graph_scores.get(user, 0)
        b = behavior_scores.get(user, 0)

        final_scores[user] = 0.6 * g + 0.4 * b

    return final_scores